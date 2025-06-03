import { INotesDataRepository, Note } from '../src';

/**
 * Mock DynamoDB Repository
 * This class is used to mock the behavior of a DynamoDB repository for testing purposes.
 * It allows you to simulate the behavior of a DynamoDB table without needing to connect to an actual database.
 */
export class MockDynamoDBRepository<T> {
  protected items: T[];

  /**
   * Constructor for the MockDynamoDBRepository class.
   *
   * @param {T[]} items An array of items to be used as the mock database.
   *
   * @template T The type of items stored in the repository.
   */
  constructor(items: T[]) {
    this.items = items;
  }
}

export class MockNotesDataRepository
  extends MockDynamoDBRepository<Note>
  implements INotesDataRepository
{
  getNoteById(noteId: string): Promise<Note | undefined> {
    const note = this.items.find((item) => item.noteId === noteId);
    return Promise.resolve(note);
  }

  getNotesOfOwner(owner: string): Promise<Note[]> {
    const notes = this.items.filter((item) => item.owner === owner);
    return Promise.resolve(notes);
  }

  hasNoteWithId(noteId: string): Promise<boolean> {
    const exists = this.items.some((item) => item.noteId === noteId);
    return Promise.resolve(exists);
  }

  putNote(noteId: string, item: Note): Promise<void> {
    const index = this.items.findIndex(
      (existingItem) => existingItem.noteId === noteId
    );
    if (index === -1) {
      this.items.push(item); // Add new note
    } else {
      this.items[index] = item; // Update existing note
    }
    return Promise.resolve();
  }

  deleteNote(noteId: string): Promise<Note | undefined> {
    const index = this.items.findIndex((item) => item.noteId === noteId);
    if (index !== -1) {
      const deletedItem = this.items.splice(index, 1)[0];
      return Promise.resolve(deletedItem);
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    return Promise.resolve(undefined);
  }
}
