import { logger } from '@/lib/pino';
import { NextFunction, Request, Response } from 'express';

export const logError = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  logger.error(err);

  return next(err);
};
