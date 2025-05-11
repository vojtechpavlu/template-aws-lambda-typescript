export class DuplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicationError';

    Object.setPrototypeOf(this, DuplicationError.prototype);
  }
}
