import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { environmentVariable } from '../util';
import { AllNotesRepository, NotesDataRepository } from '../repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { registerNewNoteResolver } from '../resolver';
import { identifierGenerationConfig } from '../config';

// Get Environment Variables
const region = environmentVariable('AWS_REGION', true);
const tableName = environmentVariable('TABLE_NAME', true);

// Load configurations
const identifierConfiguration = identifierGenerationConfig();

// Create a DynamoDB clients
const client = new DynamoDBClient({ region });

// Create a Document DynamoDB client
const documentClient = DynamoDBDocumentClient.from(client);

// Create a repository instance
const notesDataRepository = new NotesDataRepository(tableName, documentClient);
const allNotesRepository = new AllNotesRepository(tableName, documentClient);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.debug(JSON.stringify(event));

  // Parse the request body
  const body = JSON.parse(event.body || '{}');

  return await registerNewNoteResolver(
    body,
    notesDataRepository,
    allNotesRepository,
    identifierConfiguration
  );
};
