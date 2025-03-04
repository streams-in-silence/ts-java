export class NoSuchElementException extends Error {
  constructor(message?: string, cause?: Error) {
    super(message, { cause });
    this.name = 'NoSuchElementException';
  }
}
