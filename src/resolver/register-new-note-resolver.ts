import { APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from '../error';
import { registerNewNote, registerNoteId } from '../service';
import { IAllNotesRepository, INotesDataRepository } from '../repository';
import { getResponseHeaders, IdentifierGenerationConfig } from '../util';

export const registerNewNoteResolver = async (
  item: Record<string, unknown>,
  notesDataRepository: INotesDataRepository,
  allNotesRepository: IAllNotesRepository,
  identifierConfig: IdentifierGenerationConfig
): Promise<APIGatewayProxyResult> => {
  try {
    // Try to register a new note
    const noteId = await registerNewNote(
      item,
      notesDataRepository,
      identifierConfig
    );

    // Register note ID as a pre-indexed field
    await registerNoteId(noteId, allNotesRepository);

    // When it's successfully registered, return a success message
    return {
      statusCode: 201,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        message: 'Note registered successfully',
        noteId,
      }),
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Handle error thrown when no such not has been found
    if (error instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: getResponseHeaders(),
        body: JSON.stringify({ message: error.message }),
      };
    }

    // Handle any other error as 500 Internal Server Error (Unknown cause)
    return {
      statusCode: 500,
      headers: getResponseHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
