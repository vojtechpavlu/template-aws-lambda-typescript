import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * Generates a DynamoDB Document Client for local development.
 *
 * Note that this client is configured to connect to a local
 * DynamoDB instance, so make sure the local DynamoDB server
 * is running on port 8000 (default).
 *
 * @returns {DynamoDBDocumentClient} DynamoDB Document Client instance.
 */
export const getDocumentClient = () => {
  const client = new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'DUMMYIDEXAMPLE',
      secretAccessKey: 'DUMMYEXAMPLEKEY',
    },
  });

  return DynamoDBDocumentClient.from(client);
};
