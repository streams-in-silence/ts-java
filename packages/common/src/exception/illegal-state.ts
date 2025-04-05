/**
 * Thrown to indicate that the code has tried to use `null` in a case where a value is required.
 */
export class IllegalStateException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'IllegalStateException';
  }
}
