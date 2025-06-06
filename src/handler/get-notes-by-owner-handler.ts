import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { environmentVariable, getResponseHeaders } from '../util';
import { NotesDataRepository } from '../repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getNotesByOwnerResolver } from '../resolver/get-notes-by-owner-resolver';

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

  // Extract the owner from the request body
  const owner = body.owner;

  if (!owner) {
    return {
      statusCode: 400,
      headers: getResponseHeaders(),
      body: JSON.stringify({ message: `Field 'owner' is required` }),
    };
  }

  return await getNotesByOwnerResolver(owner, notesDataRepository);
};
