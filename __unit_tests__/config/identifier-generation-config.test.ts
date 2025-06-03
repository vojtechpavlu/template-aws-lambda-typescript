import { identifierGenerationConfig } from '../../src';

describe('identifier generation config', () => {
  it('should return the correct configuration', () => {
    const config = identifierGenerationConfig();
    expect(config).toEqual({
      generator: expect.any(Function),
      length: 16,
      maxRetries: 10,
    });
  });

  it('should have a generator function', () => {
    const config = identifierGenerationConfig();
    expect(typeof config.generator).toBe('function');
  });

  it('should have a length of 16', () => {
    const config = identifierGenerationConfig();
    // eslint-disable-next-line jest/prefer-to-have-length -- length is a custom property of the object
    expect(config.length).toBe(16);
  });

  it('should have a maxRetries of 10', () => {
    const config = identifierGenerationConfig();
    expect(config.maxRetries).toBe(10);
  });
});
