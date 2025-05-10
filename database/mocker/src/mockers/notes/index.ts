import { Mocker } from '../model';
import { allNotes } from './all-notes';
import { notesData } from './note-data';

const tableName = 'notes-table';

export const notesDataMocker: Mocker = {
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
        AttributeName: 'owner',
        AttributeType: 'S',
      },
    ],

    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },

    GlobalSecondaryIndexes: [
      {
        IndexName: 'owner-index',
        KeySchema: [
          {
            AttributeName: 'owner',
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
  items: [...notesData, ...allNotes],
};
