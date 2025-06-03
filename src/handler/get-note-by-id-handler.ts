import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { environmentVariable, getResponseHeaders } from '../util';
import { NotesDataRepository } from '../repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getNoteByIdResolver } from '../resolver';

// Get Environment Variables
const region = environmentVariable('AWS_REGION', true);
const tableName = environmentVariable('TABLE_NAME', true);

// Create a DynamoDB clients
const client = new DynamoDBClient({ region });

// Create a Document DynamoDB client
const documentClient = DynamoDBDocumentClient.from(client);

// Create a NotesDataRepository instance
const notesDataRepository = new NotesDataRepository(tableName, documentClient);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.debug(JSON.stringify(event));

  // Parse the request body
  const body = JSON.parse(event.body || '{}');

  // Extract the noteId from the request body
  const noteId = body.noteId;

  if (!noteId) {
    return {
      statusCode: 400,
      headers: getResponseHeaders(),
      body: JSON.stringify({ message: `Field 'noteId' is required` }),
    };
  }

  return await getNoteByIdResolver(noteId, notesDataRepository);
};
