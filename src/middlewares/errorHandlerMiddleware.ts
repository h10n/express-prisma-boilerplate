import {
  APP_ENV,
  ERROR_CODES,
  ERROR_MESSAGES,
  REQUEST_STATUSES,
} from '@/constants';
import { ENV } from '@/config/environment';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z, ZodIssue } from 'zod';
import { ValidationError } from '@/errors/ValidationError';
import { FileUploadError } from '@/errors/FileUploadError';

type TAppError = Error & {
  status: string;
  statusCode: number;
  isOperational: boolean;
};

const classifyError = (err: Error): TAppError => {
  const error = err as TAppError;
  error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  error.status =
    error.statusCode >= 400 && error.statusCode < 500
      ? REQUEST_STATUSES.FAIL
      : REQUEST_STATUSES.ERROR;
  error.isOperational = error.isOperational ?? false;
  return error;
};

const devErrors = (res: Response, err: TAppError) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    code: err.isOperational
      ? ERROR_CODES.OPERATIONAL_ERROR
      : ERROR_CODES.APP_ERROR,
    stackTrace: err.stack,
    error: err,
  });
};

const prodErrors = (res: Response, err: TAppError) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      code: ERROR_CODES.OPERATIONAL_ERROR,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: REQUEST_STATUSES.ERROR,
      message: ERROR_MESSAGES.GENERIC_ERROR,
      code: ERROR_CODES.APP_ERROR,
    });
  }
};

const sendErrors = (res: Response, err: TAppError) => {
  if (ENV.NODE_ENV === APP_ENV.DEVELOPMENT) {
    devErrors(res, err);
  } else if (ENV.NODE_ENV === APP_ENV.PRODUCTION) {
    prodErrors(res, err);
  }
};

export const handleError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: REQUEST_STATUSES.FAIL,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      code: ERROR_CODES.REQUEST_VALIDATION_ERROR,
      errors: err.errors.map((issue: ZodIssue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    });
  } else if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      status: REQUEST_STATUSES.FAIL,
      message: err.message,
      code: err.errorCode,
    });
  } else if (err instanceof FileUploadError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: REQUEST_STATUSES.ERROR,
      message: err.message,
      code: err.errorCode,
    });
  } else if (err instanceof Error) {
    const error = classifyError(err);
    sendErrors(res, error);
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: REQUEST_STATUSES.ERROR,
      message: ERROR_MESSAGES.GENERIC_ERROR,
      code: ERROR_CODES.UNEXPECTED_ERROR,
    });
  }
};
