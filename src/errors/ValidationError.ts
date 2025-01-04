export class ValidationError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode < 400 || statusCode > 599 ? 500 : statusCode;
    this.code = code;

    Error.captureStackTrace(this);
  }
}

// usage:
// throw new ValidationError(
//   "Incorrect email or password",
//   401
// );
