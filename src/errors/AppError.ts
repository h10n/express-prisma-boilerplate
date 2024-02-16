export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode < 400 || statusCode > 599 ? 500 : statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this);
  }
}

// usage:
// throw new AppError(
//   "Due to the mismatch between the client defined user and existing users in the database...",
//   404
// );
