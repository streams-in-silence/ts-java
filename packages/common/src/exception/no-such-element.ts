/**
 * Thrown by the code to indicate that the element being requested does not exist.
 */
export class NoSuchElementException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NoSuchElementException';
  }
}
