import { MockNotesDataRepository } from "../__mock/ddb-repository";
import { getNotesData } from "../__mock/mock-data";
import { getNotesByOwnerResolver, INotesDataRepository } from "../src";

let mockRepository: INotesDataRepository;

const EXISTING_OWNER = '43b5ce374e1ed63c'; // Example note ID for testing

describe('getNotesByOwnerResolver', () => {
  beforeEach(() => {
    // Initialize the mock repository with predefined notes data
    // before each test case
    mockRepository = new MockNotesDataRepository(getNotesData());
  });

  it('should return 200 status code on owner with existing notes', async () => {
    const result = await getNotesByOwnerResolver(EXISTING_OWNER, mockRepository);

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
  });

  it('should return expected data on existing note', async () => {
    const result = await getNotesByOwnerResolver(EXISTING_OWNER, mockRepository);

    expect(result).toBeDefined();
    expect(result.body).toBeDefined();
    expect(typeof result.body).toBe('string');

    const noteData = JSON.parse(result.body);
    expect(noteData).toBeDefined();
    expect(Array.isArray(noteData)).toBe(true);
    expect(noteData.length).toBeGreaterThan(0); // Ensure there are some notes
  });

  it('should return 404 on non-existing note', async () => {
    const result = await getNotesByOwnerResolver('non-existing', mockRepository);

    expect(result.statusCode).toBe(404);
  });
});