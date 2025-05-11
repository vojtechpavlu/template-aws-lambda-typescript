import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  DeleteItemCommand,
  Entity,
  EntityFormatter,
  GetItemCommand,
  item,
  PutItemCommand,
  QueryCommand,
  string,
} from 'dynamodb-toolbox';
import { AbstractNotesRepository } from './abstract-notes-repository';

export interface IAllNotesRepository {
  getAllNoteIds(): Promise<string[]>;
  hasNoteWithId(noteId: string): Promise<boolean>;
  registerNoteId(noteId: string): Promise<void>;
  deleteNoteId(noteId: string): Promise<string | undefined>;
}

export class AllNotesRepository extends AbstractNotesRepository {
  private readonly entity;

  constructor(tableName: string, documentClient: DynamoDBDocumentClient) {
    super(tableName, documentClient);

    this.entity = new Entity({
      name: 'AllNotes',
      table: this.table,
      schema: item({
        notes: string().savedAs('PK').key().default('NOTES').hidden(),
        noteId: string().savedAs('SK').key(),
      }),
      timestamps: {
        created: { name: 'createdAt', savedAs: 'createdAt' },
        modified: { name: 'modifiedAt', savedAs: 'modifiedAt' },
      },
    });
  }

  async getAllNoteIds(): Promise<string[]> {
    const { Items } = await this.table
      .build(QueryCommand)
      .query({ partition: 'NOTES' })
      .send();

    // If no items are found, log a message and return an empty array
    if (!Items || Items.length === 0) {
      console.debug(`No registered notes found`);
      return [];
    }

    // Format the items using the entity formatter
    const formattedInstances = Items.map((item: Record<string, unknown>) =>
      this.entity.build(EntityFormatter).format(item)
    );

    // Return the found notes as an array of strings
    return formattedInstances.map((note) => note.noteId) ?? [];
  }

  async hasNoteWithId(noteId: string): Promise<boolean> {
    const { Item } = await this.entity
      .build(GetItemCommand)
      .key({ noteId })
      .send();

    return !!Item;
  }

  async registerNoteId(noteId: string): Promise<void> {
    await this.entity.build(PutItemCommand).item({ noteId }).send();
  }

  async deleteNoteId(noteId: string): Promise<string | undefined> {
    const { Attributes } = await this.entity
      .build(DeleteItemCommand)
      .key({ noteId })
      .options({ returnValues: 'ALL_OLD' })
      .send();

    return Attributes?.noteId;
  }
}
