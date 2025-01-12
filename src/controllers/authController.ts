import { NextFunction, Request, Response } from 'express';
import { lucia } from '@/config/lucia';
import { StatusCodes } from 'http-status-codes';
import {
  validateUserCredentials,
  createUserSession,
  getUserSession,
} from '@/services/authService';
import { ValidationError } from '@/errors/ValidationError';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await validateUserCredentials(email, password);

    if (!user) {
      throw new ValidationError(
        'Incorrect email or password.',
        'INVALID_CREDENTIALS',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const session = await createUserSession(user.id);

    res
      .setHeader('Set-Cookie', session.cookie)
      .status(StatusCodes.OK)
      .json({
        status: 'success',
        message: 'Login was successful.',
        data: {
          token: session.token,
          user,
        },
      });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (_: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.session) {
      throw new ValidationError(
        'No session exists for the user.',
        'SESSION_NOT_FOUND',
        StatusCodes.UNAUTHORIZED,
      );
    }

    await lucia.invalidateUserSessions(res.locals.session.userId);

    return res
      .setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
      .status(StatusCodes.OK)
      .json({
        status: 'success',
        message: 'You have been logged out successfully.',
        data: null,
      });
  } catch (err) {
    return next(err);
  }
};

export const getSession = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { session, user } = res.locals;

    if (!session || !user) {
      throw new ValidationError(
        'Session or user not found.',
        'SESSION_OR_USER_NOT_FOUND',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const userData = await getUserSession(user.email);

    if (!userData) {
      throw new ValidationError(
        'User data not found.',
        'USER_DATA_NOT_FOUND',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const data = {
      ...session,
      user: userData,
    };

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Session is active. User data retrieved successfully.',
      data,
    });
  } catch (err) {
    return next(err);
  }
};
