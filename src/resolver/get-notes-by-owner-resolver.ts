import { APIGatewayProxyResult } from 'aws-lambda';
import { INotesDataRepository } from '../repository';
import { NotFoundError } from '../error';
import { getNotesByOwner } from '../service/notes-service';

export const getNotesByOwnerResolver = async (
  owner: string,
  notesDataRepository: INotesDataRepository
): Promise<APIGatewayProxyResult> => {
  try {
    // Try to find notes by owner
    const foundNotes = await getNotesByOwner(owner, notesDataRepository);

    // When it's successfully found, return the note
    return {
      statusCode: 200,
      body: JSON.stringify(foundNotes),
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Handle error thrown when no such note has been found
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `No note having owner '${owner}' found`,
        }),
      };
    }

    // Handle any other error as 500 Internal Server Error (Unknown cause)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
