import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { createTable, deleteTable } from './utils';
import { Mocker, mockers } from './mockers';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://dynamodb-local:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const documentClient = DynamoDBDocumentClient.from(client);

const tableInitialization = async (client: DynamoDBClient, mocker: Mocker) => {
  try {
    await deleteTable(client, mocker.tableName);
    console.log(`Table ${mocker.tableName} deleted`);
  } catch (error) {
    console.error('Error deleting table', error);
  }

  try {
    await createTable(client, mocker.tableParameters);
    console.log(`Table ${mocker.tableName} (re)created`);
  } catch (error) {
    console.error('Error creating table', error);
  }
};

const mockTable = async (mocker: Mocker) => {
  return Promise.all(
    mocker.items.map((item) => {
      console.log('Inserting item', JSON.stringify(item));

      const parameters = {
        TableName: mocker.tableName,
        Item: item,
      };

      const command = new PutCommand(parameters);
      return documentClient.send(command);
    })
  );
};

const processMocks = async () => {
  Promise.all(
    mockers.map(async (mocker) => {
      // (Re)create the table
      await tableInitialization(client, mocker);

      // Insert all the required items
      return await mockTable(mocker);
    })
  )
    .then(() => console.log('Mock finished successfully!'))
    .catch((error) => console.error('Error mocking tables', error));
};

processMocks();
