import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Table } from 'dynamodb-toolbox';

/**
 * Abstract base class for DynamoDB repositories.
 */
export abstract class AbstractNotesRepository {
  protected readonly table;

  constructor(tableName: string, documentClient: DynamoDBDocumentClient) {
    this.table = new Table({
      name: tableName,
      partitionKey: { name: 'PK', type: 'string' },
      sortKey: { name: 'SK', type: 'string' },
      documentClient,
      indexes: {
        'owner-index': {
          type: 'global',
          partitionKey: { name: 'owner', type: 'string' },
        },
      },
    });
  }
}
