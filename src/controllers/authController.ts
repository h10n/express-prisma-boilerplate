import { NextFunction, Request, Response } from 'express';
import { lucia } from '@/config/lucia';
import { StatusCodes } from 'http-status-codes';
import {
  validateUserCredentials,
  createUserSession,
  getUserSession,
  checkUserSession,
} from '@/services/authService';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await validateUserCredentials(email, password);

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
    const { session, user } = res.locals;

    await checkUserSession(session, user);

    await lucia.invalidateUserSessions(session.userId);

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

    await checkUserSession(session, user);

    const userData = await getUserSession(user.email);

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
