import { CreateTableCommandInput } from '@aws-sdk/client-dynamodb';

export type Mocker = {
  tableName: string;
  tableParameters: CreateTableCommandInput;
  items: Record<string, unknown>[];
};
