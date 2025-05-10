import { Mocker } from '../model';
import { applicationData } from './application-data';
import { developerData } from './developer-data';

const tableName = 'mock-table';

export const developerDataMocker: Mocker = {
  tableName: tableName,
  tableParameters: {
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: 'PK',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'SK',
        KeyType: 'RANGE',
      },
    ],

    AttributeDefinitions: [
      {
        AttributeName: 'PK',
        AttributeType: 'S',
      },
      {
        AttributeName: 'SK',
        AttributeType: 'S',
      },
      {
        AttributeName: 'email',
        AttributeType: 'S',
      },
    ],

    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },

    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          {
            AttributeName: 'email',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
  },
  items: [...developerData, ...applicationData],
};
