export class DenialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DenialError';

    Object.setPrototypeOf(this, DenialError.prototype);
  }
}
