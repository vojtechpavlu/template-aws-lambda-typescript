import { ValidationError } from '../../src';

describe('ValidationError', () => {
  it('should create an instance of ValidationError', () => {
    const error = new ValidationError('Invalid Input');
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should have the correct name', () => {
    const error = new ValidationError('Invalid Input');
    expect(error.name).toBe('ValidationError');
  });

  it('should have the correct message', () => {
    const error = new ValidationError('Invalid Input');
    expect(error.message).toBe('Invalid Input');
  });
});
