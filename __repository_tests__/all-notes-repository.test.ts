import { getDocumentClient } from '../__mock';
import { AllNotesRepository } from '../src';

// Name of the mocked table
const TABLE_NAME = 'notes-table';

// Values stored in database
const EXISTING_NOTE_ID = 'a7b2ce074c1dd6bc';

// Create an instance of the AllNotesRepository using the mocked document client
// Note it's connecting to a local DynamoDB instance, so ensure that the local server is running.
const repository = new AllNotesRepository(TABLE_NAME, getDocumentClient());

describe('AllNotesRepository', () => {
  describe('getAllNoteIds', () => {
    it('should return all registered note IDs', async () => {
      const noteIds = await repository.getAllNoteIds();

      expect(noteIds).toBeDefined();
      expect(Array.isArray(noteIds)).toBe(true);
      expect(noteIds.length).toBeGreaterThan(0); // Ensure there are some note IDs
    });
  });

  describe('hasNoteWithId', () => {
    it('should return true for an existing note ID', async () => {
      const exists = await repository.hasNoteWithId(EXISTING_NOTE_ID);

      expect(exists).toBe(true);
    });

    it('should return false for a non-existing note ID', async () => {
      const exists = await repository.hasNoteWithId('non-existing-id');

      expect(exists).toBe(false);
    });
  });
});
