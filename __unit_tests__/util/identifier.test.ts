import { generateRandomString, generateUniqueIdentifier } from '../../src';

describe('identifier utilities', () => {
  describe('generateRandomString', () => {
    it('should generate a random string of the specified length', () => {
      const length = 10;
      const randomString = generateRandomString(length);

      expect(randomString).toHaveLength(length);
    });

    it('should generate a string consisting of hexadecimal characters', () => {
      const randomString = generateRandomString(10);

      expect(/^[\da-f]+$/.test(randomString)).toBe(true);
    });

    it('should throw a TypeError if length is not a number', () => {
      expect(() => generateRandomString('10' as unknown as number)).toThrow(
        `Length must be a number`
      );
    });

    it('should throw an Error if length is less than 1', () => {
      expect(() => generateRandomString(0)).toThrow(
        `Length must be greater than 0`
      );
    });

    it('should throw when length is not an integer', () => {
      expect(() => generateRandomString(10.5)).toThrow(
        `Length must be an integer`
      );
    });
  });

  describe('generateUniqueIdentifier', () => {
    it('should generate a unique identifier', async () => {
      const mockConfig = {
        generator: jest.fn(() => 'unique-id'),
        length: 10,
        maxRetries: 5,
      };

      const mockIsUnique = jest.fn(() => Promise.resolve(true));

      const result = await generateUniqueIdentifier(mockConfig, mockIsUnique);

      expect(result).toBe('unique-id');
      expect(mockConfig.generator).toHaveBeenCalledTimes(1);
      expect(mockIsUnique).toHaveBeenCalledWith('unique-id');
    });

    it('should retry generating a unique identifier', async () => {
      const mockConfig = {
        generator: jest.fn(() => 'non-unique-id'),
        length: 10,
        maxRetries: 5,
      };
      const mockIsUnique = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const result = await generateUniqueIdentifier(mockConfig, mockIsUnique);

      expect(result).toBe('non-unique-id');
      expect(mockConfig.generator).toHaveBeenCalledTimes(2);
      expect(mockIsUnique).toHaveBeenCalledWith('non-unique-id');
    });

    it('should throw an error if max retries is reached', async () => {
      const mockConfig = {
        generator: jest.fn(() => 'non-unique-id'),
        length: 10,
        maxRetries: 3,
      };
      const mockIsUnique = jest.fn(() => Promise.resolve(false));

      await expect(
        generateUniqueIdentifier(mockConfig, mockIsUnique)
      ).rejects.toThrow(
        'Failed to generate a unique identifier after maximum retries (maxRetries: 3)'
      );
    });

    it('should throw an error if max retries is less than or equal to zero', async () => {
      const mockConfig = {
        generator: jest.fn(),
        length: 10,
        maxRetries: 0,
      };

      const mockIsUnique = jest.fn();

      await expect(
        generateUniqueIdentifier(mockConfig, mockIsUnique)
      ).rejects.toThrow(
        'Failed to generate a unique identifier after maximum retries (maxRetries: 0)'
      );
    });
  });
});
