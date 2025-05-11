import { DuplicationError, NotFoundError, ValidationError } from '../error';
import { IAllNotesRepository, INotesDataRepository } from '../repository';
import { Note, NoteInputSchema } from '../model';
import {
  generateUniqueIdentifier,
  IdentifierGenerationConfig,
  parseZodError,
} from '../util';

/**
 * Returns a note by its ID.
 *
 * @param {string} noteId ID of the note to be retrieved
 * @param {INotesDataRepository} notesDataRepository The repository to be used to fetch the note
 *
 * @returns {Promise<Note>} The note with the given ID
 *
 * @throws {NotFoundError} If no note with the given ID is found
 */
export const getNoteById = async (
  noteId: string,
  notesDataRepository: INotesDataRepository
): Promise<Note> => {
  const foundNote = await notesDataRepository.getNoteById(noteId);

  if (!foundNote) {
    throw new NotFoundError(`Note with ID '${noteId}' not found`);
  }

  return foundNote;
};

/**
 * Returns all notes of a given owner.
 *
 * @param {string} owner ID of the owner whose notes are to be retrieved
 * @param {INotesDataRepository} notesDataRepository The repository to be used to fetch the notes
 *
 * @returns {Promise<Note[]>} An array of notes belonging to the owner
 *
 * @throws {NotFoundError} If no notes are found for the given owner
 */
export const getNotesByOwner = async (
  owner: string,
  notesDataRepository: INotesDataRepository
): Promise<Note[]> => {
  const notes = await notesDataRepository.getNotesOfOwner(owner);

  if (!notes || notes.length === 0) {
    throw new NotFoundError(`No notes found for owner ${owner}`);
  }

  return notes;
};

/**
 * Returns all note IDs from the repository.
 *
 * @param {IAllNotesRepository} allNotesRepository The repository to be used to fetch the note IDs
 *
 * @returns {Promise<string[]>} An array of all note IDs
 *
 * @throws {NotFoundError} If no notes are found
 */
export const getAllNoteIds = async (
  allNotesRepository: IAllNotesRepository
) => {
  const noteIds = await allNotesRepository.getAllNoteIds();

  if (!noteIds || noteIds.length === 0) {
    throw new NotFoundError(`No registered notes found`);
  }

  return noteIds;
};

/**
 * Returns whether there is a pre-indexed note.
 *
 * @param {string} noteId ID of the note to be checked
 * @param {IAllNotesRepository} allNotesRepository The repository to be used to check the note
 *
 * @returns {Promise<boolean>} True if the note exists, false otherwise
 */
export const hasIndexedNoteWithId = async (
  noteId: string,
  allNotesRepository: IAllNotesRepository
): Promise<boolean> => {
  return allNotesRepository.hasNoteWithId(noteId);
};

/**
 * Registers a new note ID in the repository.
 *
 * @param {string} noteId ID of the note to be registered
 * @param {IAllNotesRepository} allNotesRepository The repository to be used to register the note ID
 *
 * @returns {Promise<void>} A promise that resolves when the note ID is registered
 *
 * @throws {DuplicationError} If the note ID already exists
 */
export const registerNoteId = async (
  noteId: string,
  allNotesRepository: IAllNotesRepository
): Promise<void> => {
  // Check if the note ID already exists
  const noteExists = await allNotesRepository.hasNoteWithId(noteId);
  if (noteExists) {
    throw new DuplicationError(`Note ID ${noteId} already exists`);
  }

  // Register the note ID
  return allNotesRepository.registerNoteId(noteId);
};

/**
 * Checks whether a note with the given ID exists in the repository.
 *
 * @param {string} noteId ID of the note to be checked
 * @param {INotesDataRepository} notesDataRepository The repository to be used to check the note
 *
 * @returns {Promise<boolean>} True if the note exists, false otherwise
 */
export const hasNoteWithId = async (
  noteId: string,
  notesDataRepository: INotesDataRepository
): Promise<boolean> => {
  return await notesDataRepository.hasNoteWithId(noteId);
};

/**
 * Registers a new note in the repository.
 *
 * @param {Record<string, unknown>} item The note data to be registered
 * @param {INotesDataRepository} notesDataRepository The repository to be used to register the note
 * @param {IdentifierGenerationConfig} identifierConfig Configuration for generating unique identifiers
 *
 * @returns {Promise<string>} The ID of the newly registered note
 *
 * @throws {Error} When the note ID could not be generated or the note data is invalid
 * @throws {ValidationError} If the note data is invalid
 */
export const registerNewNote = async (
  item: Record<string, unknown>,
  notesDataRepository: INotesDataRepository,
  identifierConfig: IdentifierGenerationConfig
): Promise<string> => {
  let parsedInput;

  try {
    // Verify and parse the given input
    parsedInput = NoteInputSchema.parse(item);
  } catch (error) {
    const issues = parseZodError(error);
    throw new ValidationError(`Invalid note data: ${JSON.stringify(issues)}`);
  }

  // Generate a new unique note ID
  const uniqueIdentifier = await generateUniqueIdentifier(
    identifierConfig,
    async (identifier) =>
      !(await hasNoteWithId(identifier, notesDataRepository))
  );

  // Insert the parsed input into the repository
  await notesDataRepository.putNote(uniqueIdentifier, parsedInput);

  return uniqueIdentifier;
};

/**
 * Updates an existing note in the repository.
 *
 * @param {string} noteId ID of the note to be updated
 * @param {Record<string, unknown>} item The new note data
 * @param {INotesDataRepository} notesDataRepository The repository to be used to update the note
 *
 * @returns {Promise<string>} The ID of the updated note
 *
 * @throws {NotFoundError} If no note with the given ID is found
 * @throws {ValidationError} If the note data is invalid
 */
export const updateNote = async (
  noteId: string,
  item: Record<string, unknown>,
  notesDataRepository: INotesDataRepository
): Promise<string> => {
  const note = await notesDataRepository.getNoteById(noteId);
  if (!note) {
    throw new NotFoundError(`Note with ID ${noteId} not found`);
  }

  let parsedInput;

  try {
    // Verify and parse the given input
    parsedInput = NoteInputSchema.parse({ ...item, noteId, owner: note.owner });
  } catch (error) {
    const issues = parseZodError(error);
    throw new ValidationError(`Invalid note data: ${JSON.stringify(issues)}`);
  }

  // Update the note in the repository
  await notesDataRepository.putNote(noteId, parsedInput);

  return noteId;
};

/**
 * Deletes a note from the repository
 *
 * @param {string} noteId ID of the note to be deleted
 * @param {INotesDataRepository} notesDataRepository The repository to be used to delete the note
 *
 * @returns {Promise<Note | undefined>} The deleted note, or undefined if no such note was found
 */
export const deleteNote = async (
  noteId: string,
  notesDataRepository: INotesDataRepository
): Promise<Note | undefined> => {
  return notesDataRepository.deleteNote(noteId);
};
