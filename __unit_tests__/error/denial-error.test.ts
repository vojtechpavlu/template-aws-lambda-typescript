import { DenialError } from '../../src';

describe('DenialError', () => {
  it('should create an instance of DenialError', () => {
    const error = new DenialError('Invalid Input');
    expect(error).toBeInstanceOf(DenialError);
  });

  it('should have the correct name', () => {
    const error = new DenialError('Invalid Input');
    expect(error.name).toBe('DenialError');
  });

  it('should have the correct message', () => {
    const error = new DenialError('Invalid Input');
    expect(error.message).toBe('Invalid Input');
  });
});
