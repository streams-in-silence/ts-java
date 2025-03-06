/**
 * Thrown to indicate that the code has tried to use `null` in a case where a value is required.
 */
export class NullPointerException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NullPointerException';
  }
}
