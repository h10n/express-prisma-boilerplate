import { ValidationError } from '@/errors/ValidationError';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const authorizeRole = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw new ValidationError(
        'Forbidden Access',
        'USER_NOT_FOUND',
        StatusCodes.FORBIDDEN,
      );
    }

    // TODO: Implement RBAC logic to check if the user has the required role(s)

    return next();
  } catch (err) {
    return next(err);
  }
};
