import { getDocumentClient } from '../__mock';
import { Note, NotesDataRepository } from '../src';

// Name of the mocked table
const TABLE_NAME = 'notes-table';

// Values stored in database
const EXISTING_NOTE_ID = 'a7b2ce074c1dd6bc';
const EXISTING_OWNER_ID = '43b5ce374e1ed63c';

// Create an instance of the NotesDataRepository using the mocked document client
// Note it's connecting to a local DynamoDB instance, so ensure that the local server is running.
const repository = new NotesDataRepository(TABLE_NAME, getDocumentClient());

describe('NotesDataRepository', () => {
  describe('getNoteById', () => {
    it('should return a note by its ID', async () => {
      const note = await repository.getNoteById(EXISTING_NOTE_ID);

      expect(note).toBeDefined();
      expect(note?.noteId).toBe(EXISTING_NOTE_ID);
    });

    it('should return undefined for a non-existing note ID', async () => {
      const note = await repository.getNoteById('non-existing-id');

      expect(note).toBeUndefined();
    });
  });

  describe('getNotesOfOwner', () => {
    it('should return notes for an existing owner', async () => {
      const notes = await repository.getNotesOfOwner(EXISTING_OWNER_ID);

      expect(notes).toBeDefined();
      expect(notes.length).toBeGreaterThan(0);
      expect(notes[0].owner).toBe(EXISTING_OWNER_ID);
    });

    it('should return an empty array for a non-existing owner', async () => {
      const notes = await repository.getNotesOfOwner('non-existing-owner');

      expect(notes).toBeDefined();
      expect(Array.isArray(notes)).toBe(true);
      expect(notes).toHaveLength(0);
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

  describe('non-idempotent operations', () => {
    it('should register a new note and then delete it', async () => {
      const note: Note = {
        noteId: 'test-note-id' + Date.now(),
        title: 'Test Note',
        content: 'This is a test note.',
        owner: EXISTING_OWNER_ID,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      // Verify the note does not exist before adding
      const existsBeforeStoring = await repository.hasNoteWithId(note.noteId);
      expect(existsBeforeStoring).toBe(false);

      // Store the note
      await repository.putNote(note.noteId, note);

      // Verify the note exists after storing
      const existsAfterStoring = await repository.hasNoteWithId(note.noteId);
      expect(existsAfterStoring).toBe(true);

      // Retrieve the note to ensure it was stored correctly
      const storedNote = await repository.getNoteById(note.noteId);
      expect(storedNote).toBeDefined();
      expect(storedNote?.noteId).toBe(note.noteId);
      expect(storedNote?.title).toBe(note.title);
      expect(storedNote?.content).toBe(note.content);
      expect(storedNote?.owner).toBe(note.owner);
      expect(storedNote?.createdAt).toBe(note.createdAt);
      expect(storedNote?.modifiedAt).toBe(note.modifiedAt);

      // Delete the note
      const deletedNote = await repository.deleteNote(note.noteId);
      expect(deletedNote).toBeDefined();
      expect(deletedNote?.noteId).toBe(note.noteId);
      expect(deletedNote?.title).toBe(note.title);
      expect(deletedNote?.content).toBe(note.content);
      expect(deletedNote?.owner).toBe(note.owner);
      expect(deletedNote?.createdAt).toBe(note.createdAt);
      expect(deletedNote?.modifiedAt).toBe(note.modifiedAt);

      // Verify the note does not exist after deletion
      const existsAfterDeletion = await repository.hasNoteWithId(note.noteId);
      expect(existsAfterDeletion).toBe(false);
    });

    it('should update an existing note', async () => {
      const note: Note = {
        noteId: 'update-note-id' + Date.now(),
        title: 'Update Note',
        content: 'This note will be updated.',
        owner: EXISTING_OWNER_ID,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      // Verify the note does not exist before updating
      const existsBeforeUpdate = await repository.hasNoteWithId(note.noteId);
      expect(existsBeforeUpdate).toBe(false);

      // Store a new note
      await repository.putNote(note.noteId, note);

      // Verify the note exists before updating
      const existsAfterStoring = await repository.hasNoteWithId(note.noteId);
      expect(existsAfterStoring).toBe(true);

      // Update the note
      const updatedNote: Note = {
        ...note,
        title: 'Updated Note Title',
        content: 'This content has been updated.',
        modifiedAt: new Date().toISOString(),
      };

      await repository.putNote(note.noteId, updatedNote);

      // Retrieve the updated note
      const retrievedNote = await repository.getNoteById(note.noteId);
      expect(retrievedNote).toBeDefined();
      expect(retrievedNote?.noteId).toBe(updatedNote.noteId);
      expect(retrievedNote?.title).toBe(updatedNote.title);
      expect(retrievedNote?.content).toBe(updatedNote.content);
      expect(retrievedNote?.owner).toBe(updatedNote.owner);
      expect(retrievedNote?.createdAt).toBe(updatedNote.createdAt);
      expect(retrievedNote?.modifiedAt).toBe(updatedNote.modifiedAt);

      // Clean up by deleting the updated note
      await repository.deleteNote(note.noteId);
      const existsAfterUpdateDeletion = await repository.hasNoteWithId(
        note.noteId
      );
      expect(existsAfterUpdateDeletion).toBe(false);
    });
  });
});
