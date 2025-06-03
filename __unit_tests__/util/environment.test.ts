import { environmentVariable } from '../../src';
// See jest.setup.js file

describe('environmentVariable function', () => {
  describe('common use-cases', () => {
    it('should return a string even when the value is numeric', () => {
      const value = environmentVariable('NUMERIC_VARIABLE', true);
      expect(typeof value).toBe('string');
      expect(value).toBe('123');
    });
  });

  describe('required variable', () => {
    it('should return the value of existing variable', () => {
      const value = environmentVariable('TEST_VARIABLE', true);
      expect(value).toBe('test-variable');
    });

    it('should not throw when variable is set', () => {
      expect(() => environmentVariable('TEST_VARIABLE', true)).not.toThrow();
    });

    it('should throw when variable is not set', () => {
      expect(() => environmentVariable('NON_EXISTENT_VARIABLE', true)).toThrow(
        'Environment variable NON_EXISTENT_VARIABLE is required'
      );
    });
  });

  describe('optional variable', () => {
    it('should return the value of existing variable', () => {
      const value = environmentVariable('TEST_VARIABLE', false);
      expect(value).toBe('test-variable');
    });

    it('should return undefined when variable is not set', () => {
      const value = environmentVariable('NON_EXISTENT_VARIABLE', false);
      expect(value).toBeUndefined();
    });

    it('should not throw when variable is not set', () => {
      expect(() =>
        environmentVariable('NON_EXISTENT_VARIABLE', false)
      ).not.toThrow();
    });
  });
});
