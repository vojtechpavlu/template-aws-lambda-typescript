import { Note } from '../../src';

export const getNotesData = (): Note[] => [
  {
    noteId: 'a7b2ce074c1dd6bc',
    title: 'My First Note',
    content: 'This is the first sample note.',
    owner: '43b5ce374e1ed63c',
    createdAt: '2021-09-29T12:00:00.000Z',
    modifiedAt: '2022-12-03T12:00:00.000Z',
  },
  {
    noteId: 'ab52fe7bac0f1d4e',
    title: 'My Second Note',
    content: 'This is the second sample note.',
    owner: '43b5ce374e1ed63c',
    createdAt: '2021-09-29T12:00:00.000Z',
    modifiedAt: '2022-12-03T12:00:00.000Z',
  },
  {
    noteId: 'f3da2fe7bc0f1d4e',
    title: 'My Third Note',
    content: 'This is a sample note.',
    owner: 'd22a530e51995d52',
    createdAt: '2021-09-29T12:00:00.000Z',
    modifiedAt: '2022-12-03T12:00:00.000Z',
  },
];
