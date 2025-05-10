import {
  CreateTableCommand,
  CreateTableCommandInput,
  DeleteTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';

export const createTable = async (
  client: DynamoDBClient,
  parameters: CreateTableCommandInput
) => {
  const command = new CreateTableCommand(parameters);
  await client.send(command);
};

export const deleteTable = async (
  client: DynamoDBClient,
  tableName: string
) => {
  const parameters = {
    TableName: tableName,
  };

  const command = new DeleteTableCommand(parameters);
  await client.send(command);
};
