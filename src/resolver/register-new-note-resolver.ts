import { APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from '../error';
import { registerNewNote } from '../service';
import { INotesDataRepository } from '../repository';
import { IdentifierGenerationConfig } from '../util';

export const registerNewNoteResolver = async (
  item: Record<string, unknown>,
  notesDataRepository: INotesDataRepository,
  identifierConfig: IdentifierGenerationConfig
): Promise<APIGatewayProxyResult> => {
  try {
    // Try to register a new note
    await registerNewNote(item, notesDataRepository, identifierConfig);

    // When it's successfully registered, return a success message
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Note registered successfully' }),
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Handle error thrown when no such not has been found
    if (error instanceof ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message }),
      };
    }

    // Handle any other error as 500 Internal Server Error (Unknown cause)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
