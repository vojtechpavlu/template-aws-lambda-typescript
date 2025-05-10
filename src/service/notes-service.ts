import { NotFoundError, ValidationError } from '../error';
import { INotesDataRepository } from '../repository';
import { Note, NoteInputSchema } from '../model';
import { generateUniqueIdentifier, IdentifierGenerationConfig } from '../util';

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
    throw new NotFoundError(`Note with ID ${noteId} not found`);
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
 * @returns {Promise<void>} A promise that resolves when the note is registered
 * 
 * @throws {Error} When the note ID could not be generated or the note data is invalid
 * @throws {ValidationError} If the note data is invalid
 */
export const registerNewNote = async (
  item: Record<string, unknown>,
  notesDataRepository: INotesDataRepository,
  identifierConfig: IdentifierGenerationConfig
): Promise<void> => {

  let parsedInput;

  try {
    // Verify and parse the given input
    parsedInput = NoteInputSchema.parse(item);
  } catch (error) {
    throw new ValidationError(`Invalid note data: ${error}`);
  }

  // Generate a new unique note ID
  const uniqueIdentifier = await generateUniqueIdentifier(
    identifierConfig,
    (identifier) => hasNoteWithId(identifier, notesDataRepository)
  );

  // Insert the parsed input into the repository
  return notesDataRepository.putNote(uniqueIdentifier, parsedInput);
};

/**
 * Updates an existing note in the repository.
 * 
 * @param {string} noteId ID of the note to be updated
 * @param {Record<string, unknown>} item The new note data
 * @param {INotesDataRepository} notesDataRepository The repository to be used to update the note
 * 
 * @returns {Promise<void>} A promise that resolves when the note is updated
 * 
 * @throws {NotFoundError} If no note with the given ID is found
 * @throws {ValidationError} If the note data is invalid
 */
export const updateNote = async (
  noteId: string,
  item: Record<string, unknown>,
  notesDataRepository: INotesDataRepository
): Promise<void> => {

  let parsedInput;

  try {
    // Verify and parse the given input
    parsedInput = NoteInputSchema.parse(item);
  } catch (error) {
    throw new ValidationError(`Invalid note data: ${error}`);
  }

  // Verify the note exists
  const noteExists = await hasNoteWithId(noteId, notesDataRepository);
  if (!noteExists) {
    throw new NotFoundError(`Note with ID ${noteId} not found`);
  }

  // Update the note in the repository
  return notesDataRepository.putNote(noteId, parsedInput);
}

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
