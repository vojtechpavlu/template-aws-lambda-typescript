import {
  DeleteItemCommand,
  Entity,
  EntityFormatter,
  GetItemCommand,
  item,
  prefix,
  PutItemCommand,
  QueryCommand,
  string,
} from 'dynamodb-toolbox';
import { Note, NoteInput, NoteSchema } from '../../model';
import { AbstractNotesRepository } from './abstract-notes-repository';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export interface INotesDataRepository {
  getNoteById(noteId: string): Promise<Note | undefined>;
  getNotesOfOwner(owner: string): Promise<Note[]>;
  hasNoteWithId(noteId: string): Promise<boolean>;
  putNote(noteId: string, item: NoteInput): Promise<void>;
  deleteNote(noteId: string): Promise<Note | undefined>;
}

export class NotesDataRepository
  extends AbstractNotesRepository
  implements INotesDataRepository
{
  private readonly entity;

  constructor(tableName: string, documentClient: DynamoDBDocumentClient) {
    super(tableName, documentClient);

    this.entity = new Entity({
      name: 'NoteData',
      table: this.table,
      schema: item({
        noteId: string().transform(prefix('NOTE')).savedAs('PK').key(),
        data: string().savedAs('SK').key().default('DATA').hidden(),
        title: string({ required: 'always' }),
        content: string({ required: 'always' }),
        owner: string({ required: 'always' }),
      }),
      timestamps: {
        created: { name: 'createdAt', savedAs: 'createdAt' },
        modified: { name: 'modifiedAt', savedAs: 'modifiedAt' },
      },
    });
  }

  async getNoteById(noteId: string): Promise<Note | undefined> {
    const { Item } = await this.entity
      .build(GetItemCommand)
      .key({ noteId })
      .send();

    return Item;
  }

  async getNotesOfOwner(owner: string): Promise<Note[]> {
    const { Items } = await this.table
      .build(QueryCommand)
      .query({ index: 'owner-index', partition: owner })
      .send();

    // If no items are found, log a message and return an empty array
    if (!Items || Items.length === 0) {
      console.debug(`No notes found for owner ${owner}`);
      return [];
    }

    // Format the items using the entity formatter
    const formattedInstances = Items.map((item: Record<string, unknown>) =>
      this.entity.build(EntityFormatter).format(item)
    );

    // Return the found notes as an array of Note objects
    return formattedInstances ?? [];
  }

  async hasNoteWithId(noteId: string): Promise<boolean> {
    const { Item } = await this.entity
      .build(GetItemCommand)
      .key({ noteId })
      .options({ attributes: ['noteId'] })
      .send();

    return !!Item;
  }

  async putNote(noteId: string, item: NoteInput): Promise<void> {
    const parsedInput = NoteSchema.parse({ ...item, noteId });

    await this.entity.build(PutItemCommand).item(parsedInput).send();

    console.debug(`Note with ID ${noteId} has been saved successfully.`);
  }

  async deleteNote(noteId: string): Promise<Note | undefined> {
    const { Attributes } = await this.entity
      .build(DeleteItemCommand)
      .key({ noteId })
      .options({ returnValues: 'ALL_OLD' })
      .send();

    return Attributes ? NoteSchema.parse(Attributes) : undefined;
  }
}
