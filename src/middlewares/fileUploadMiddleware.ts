import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { validateFile } from '@/services/fileUploadService';
import { FileUploadError } from '@/errors/FileUploadError';
import { FileUploadOptions } from '@/types/fileUploadType';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const options: FileUploadOptions = (req as any).uploadOptions || {};

  const validation = validateFile(file, options);

  if (validation.isValid) {
    cb(null, true);
  } else {
    cb(new FileUploadError(validation.error!, 'INVALID_FILE'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

export const setUploadOptions = (options: FileUploadOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as any).uploadOptions = options;
    next();
  };
};

export const uploadSingle = (
  fieldName: string,
  options?: FileUploadOptions,
) => {
  const middlewares = [];

  if (options) {
    middlewares.push(setUploadOptions(options));
  }

  middlewares.push(upload.single(fieldName));

  return middlewares;
};

export const uploadMultiple = (
  fieldName: string,
  maxCount?: number,
  options?: FileUploadOptions,
) => {
  const middlewares = [];

  if (options) {
    middlewares.push(setUploadOptions(options));
  }

  middlewares.push(upload.array(fieldName, maxCount || 10));

  return middlewares;
};

export const uploadFields = (
  fields: multer.Field[],
  options?: FileUploadOptions,
) => {
  const middlewares = [];

  if (options) {
    middlewares.push(setUploadOptions(options));
  }

  middlewares.push(upload.fields(fields));

  return middlewares;
};

export const handleUploadError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof multer.MulterError) {
    let statusCode = 400;
    let message = 'File upload error';
    let errorCode = 'UPLOAD_ERROR';

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        statusCode = 413;
        message = 'File too large';
        errorCode = 'FILE_TOO_LARGE';
        break;
      case 'LIMIT_FILE_COUNT':
        statusCode = 413;
        message = 'Too many files';
        errorCode = 'TOO_MANY_FILES';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        statusCode = 400;
        message = 'Unexpected file field';
        errorCode = 'UNEXPECTED_FILE';
        break;
      default:
        statusCode = 400;
        message = error.message;
        errorCode = 'MULTER_ERROR';
    }

    return res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message,
      },
    });
  }

  if (error instanceof FileUploadError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
      },
    });
  }

  next(error);
};
