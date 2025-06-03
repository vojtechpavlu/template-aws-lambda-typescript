import { DuplicationError } from '../../src';

describe('DuplicationError', () => {
  it('should create an instance of DuplicationError', () => {
    const error = new DuplicationError('Duplicate entry');
    expect(error).toBeInstanceOf(DuplicationError);
  });

  it('should have the correct name', () => {
    const error = new DuplicationError('Duplicate entry');
    expect(error.name).toBe('DuplicationError');
  });

  it('should have the correct message', () => {
    const error = new DuplicationError('Duplicate entry');
    expect(error.message).toBe('Duplicate entry');
  });
});
