import { parseZodError } from '../../src';
import { ZodError, ZodIssue } from 'zod';

describe('Zod Error Parser', () => {
  describe('Zod Error Parser', () => {
    it('should parse a single ZodError issue correctly', () => {
      const error = new ZodError([
        {
          path: ['user', 'email'],
          message: 'Invalid email address',
          code: 'invalid_string',
        } as ZodIssue,
      ]);
      const result = parseZodError(error);
      expect(result).toBe(
        "'user.email' error message: Invalid email address (invalid_string)"
      );
    });

    it('should parse multiple ZodError issues correctly', () => {
      const error = new ZodError([
        {
          path: ['user', 'email'],
          message: 'Invalid email address',
          code: 'invalid_string',
        } as ZodIssue,
        {
          path: ['user', 'age'],
          message: 'Must be 18 or older',
          code: 'too_small',
        } as ZodIssue,
      ]);
      const result = parseZodError(error);
      expect(result).toBe(
        "'user.email' error message: Invalid email address (invalid_string), " +
          "'user.age' error message: Must be 18 or older (too_small)"
      );
    });

    it('should return "Unknown error" for non-ZodError input', () => {
      const error = new Error('Some other error');
      const result = parseZodError(error);
      expect(result).toBe('Unknown error');
    });

    it('should handle ZodError with empty issues array', () => {
      const error = new ZodError([]);
      const result = parseZodError(error);
      expect(result).toBe('');
    });

    it('should handle ZodError issue with empty path', () => {
      const error = new ZodError([
        {
          path: [],
          message: 'Required',
          code: 'invalid_type',
        } as never,
      ]);
      const result = parseZodError(error);
      expect(result).toBe("'' error message: Required (invalid_type)");
    });
  });
});
