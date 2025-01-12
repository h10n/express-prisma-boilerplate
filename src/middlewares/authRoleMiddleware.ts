import { ValidationError } from '@/errors/ValidationError';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const authorizeRole = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { session, user } = res.locals;

    if (!session || !user) {
      throw new ValidationError(
        'Authentication required. Please log in to access this resource.',
        'AUTHENTICATION_REQUIRED',
        StatusCodes.UNAUTHORIZED,
      );
    }

    // TODO: Implement RBAC logic to check if the user has the required role(s)
    // throw new ValidationError(
    //   'Access denied. Your role does not have permission to access this resource.',
    //   'ROLE_FORBIDDEN',
    //   StatusCodes.FORBIDDEN,
    // );

    // TODO: Get User Data from database

    return next();
  } catch (err) {
    return next(err);
  }
};
