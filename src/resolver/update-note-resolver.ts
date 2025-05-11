import { APIGatewayProxyResult } from 'aws-lambda';
import { INotesDataRepository } from '../repository';
import { updateNote } from '../service';
import { NotFoundError, ValidationError } from '../error';

export const updateNoteResolver = async (
  noteId: string,
  item: Record<string, unknown>,
  notesDataRepository: INotesDataRepository
): Promise<APIGatewayProxyResult> => {
  try {
    await updateNote(noteId, item, notesDataRepository);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Note updated successfully',
        noteId,
      }),
    };
  } catch (error) {
    console.error(error);

    // When the input is not valid (does not match the schema)
    if (error instanceof ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid note data',
          error: error.message,
        }),
      };
    }

    // When the note with the given ID is not found
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Note not found',
          noteId,
        }),
      };
    }

    // Otherwise, return 500 Internal Server Error
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
