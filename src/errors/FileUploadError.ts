import { StatusCodes } from 'http-status-codes';

export class FileUploadError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(
    message: string,
    errorCode: string,
    statusCode: number = StatusCodes.BAD_REQUEST,
  ) {
    super(message);
    this.name = 'FileUploadError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }

  static fileTooLarge(maxSize: number): FileUploadError {
    return new FileUploadError(
      `File size exceeds maximum allowed size of ${maxSize} bytes`,
      'FILE_TOO_LARGE',
      StatusCodes.REQUEST_TOO_LONG,
    );
  }

  static invalidFileType(allowedTypes: string[]): FileUploadError {
    return new FileUploadError(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      'INVALID_FILE_TYPE',
      StatusCodes.BAD_REQUEST,
    );
  }

  static uploadFailed(fileName: string): FileUploadError {
    return new FileUploadError(
      `Failed to upload file: ${fileName}`,
      'UPLOAD_FAILED',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  static fileNotFound(filePath: string): FileUploadError {
    return new FileUploadError(
      `File not found: ${filePath}`,
      'FILE_NOT_FOUND',
      StatusCodes.NOT_FOUND,
    );
  }

  static deleteFailed(filePath: string): FileUploadError {
    return new FileUploadError(
      `Failed to delete file: ${filePath}`,
      'DELETE_FAILED',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  static invalidFileData(): FileUploadError {
    return new FileUploadError(
      'Invalid file data provided',
      'INVALID_FILE_DATA',
      StatusCodes.BAD_REQUEST,
    );
  }
}
