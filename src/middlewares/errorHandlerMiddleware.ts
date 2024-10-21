import { APP_ENV, REQUEST_STATUSES } from '@/constants';
import { ENV } from 'config';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

type TAppError = Error & {
  status: string;
  statusCode: number;
  isOperational: boolean;
};

const devErrors = (res: Response, err: TAppError) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
    error: err,
  });
};

const prodErrors = (res: Response, err: TAppError) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: REQUEST_STATUSES.ERROR,
      message: 'Something went wrong! Please try again later.',
    });
  }
};

const sendErrors = (res: Response, err: Error) => {
  const error = err as TAppError;
  error.statusCode = error.statusCode || 500;
  error.status =
    error.statusCode >= 400 && error.statusCode < 500 ? 'fail' : 'error';

  if (ENV.NODE_ENV === APP_ENV.DEVELOPMENT) {
    devErrors(res, error);
  } else if (ENV.NODE_ENV === APP_ENV.PRODUCTION) {
    prodErrors(res, error);
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
      error: err.flatten(),
    });
  } else if (err instanceof Error) {
    sendErrors(res, err);
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: REQUEST_STATUSES.ERROR,
      message: 'Internal server error',
    });
  }
};
