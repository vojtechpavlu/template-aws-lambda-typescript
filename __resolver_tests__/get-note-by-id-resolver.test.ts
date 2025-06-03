import { MockNotesDataRepository } from "../__mock/ddb-repository";
import { getNotesData } from "../__mock/mock-data";
import { getNoteByIdResolver, INotesDataRepository } from "../src";

let mockRepository: INotesDataRepository;

const EXISTING_NOTE_ID = 'a7b2ce074c1dd6bc'; // Example note ID for testing

describe('getNoteByIdResolver', () => {
  beforeEach(() => {
    // Initialize the mock repository with predefined notes data
    // before each test case
    mockRepository = new MockNotesDataRepository(getNotesData());
  });

  it('should return 200 status code on existing note', async () => {
    const result = await getNoteByIdResolver(EXISTING_NOTE_ID, mockRepository);

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
  });

  it('should return expected data on existing note', async () => {
    const result = await getNoteByIdResolver(EXISTING_NOTE_ID, mockRepository);

    expect(result).toBeDefined();
    expect(result.body).toBeDefined();
    expect(typeof result.body).toBe('string');

    const noteData = JSON.parse(result.body);
    expect(noteData).toBeDefined();
    expect(noteData.noteId).toBe(EXISTING_NOTE_ID);
  });

  it('should return 404 on non-existing note', async () => {
    const result = await getNoteByIdResolver('non-existing', mockRepository);

    expect(result.statusCode).toBe(404);
  });
});