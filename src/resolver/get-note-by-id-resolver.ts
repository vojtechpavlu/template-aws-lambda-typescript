
import { APIGatewayProxyResult } from 'aws-lambda';
import { INotesDataRepository } from '../repository';
import { getNoteById } from '../service';
import { NotFoundError } from '../error';

export const getNoteByIdResolver = async (
  noteId: string,
  notesDataRepository: INotesDataRepository
): Promise<APIGatewayProxyResult> => {
  try {
    // Try to find the note by ID
    const foundNote = await getNoteById(noteId, notesDataRepository);

    // When it's successfully found, return the note
    return {
      statusCode: 200,
      body: JSON.stringify(foundNote),
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    
    // Handle error thrown when no such not has been found
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `No note with ID '${noteId}' found` }),
      }
    }

    // Handle any other error as 500 Internal Server Error (Unknown cause)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
};
