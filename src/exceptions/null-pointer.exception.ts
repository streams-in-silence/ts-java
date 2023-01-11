export class NullPointerException extends Error {
  constructor(message?: string, cause?: Error) {
    super(message, { cause });
    this.name = 'NullPointerException';
  }
}
