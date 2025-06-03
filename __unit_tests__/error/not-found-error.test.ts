import { NotFoundError } from '../../src';

describe('NotFoundError', () => {
  it('should create an instance of NotFoundError', () => {
    const error = new NotFoundError('Not Found');
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('should have the correct name', () => {
    const error = new NotFoundError('Not Found');
    expect(error.name).toBe('NotFoundError');
  });

  it('should have the correct message', () => {
    const error = new NotFoundError('Not Found');
    expect(error.message).toBe('Not Found');
  });
});
