import { NextFunction, Request, Response } from 'express';
import { lucia } from '@/config/lucia';
import { StatusCodes } from 'http-status-codes';
import {
  validateUserCredentials,
  createUserSession,
} from '@/services/authService';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await validateUserCredentials(email, password);

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'fail',
        message: 'Authentication Failed',
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Incorrect email or password.',
        },
      });
    }

    const session = await createUserSession(user.id);

    res
      .setHeader('Set-Cookie', session.cookie)
      .status(StatusCodes.OK)
      .json({
        status: 'success',
        message: 'Login successful',
        data: {
          token: session.token,
          user,
        },
      });
  } catch (err) {
    next(err);
  }
};

export const logout = async (_: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.session) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'fail',
        message: 'No active session found',
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'No session exists for the user.',
        },
      });
    }

    await lucia.invalidateUserSessions(res.locals.session.userId);

    return res
      .setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
      .status(StatusCodes.OK)
      .json({
        status: 'success',
        message: 'Logout successful',
        data: null,
      });
  } catch (err) {
    next(err);
  }
};
