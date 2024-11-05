import { lucia } from '@/config/lucia';
import { APP_ENV } from '@/constants';
import { ENV } from '@/config/environment';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyRequestOrigin } from 'lucia';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (ENV.NODE_ENV === APP_ENV.PRODUCTION && req.method !== 'GET') {
    const originHeader = req.headers.origin ?? null;
    const hostHeader = req.headers.host ?? null;

    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({
          message: 'CSRF Error',
        })
        .end();
    }
  }

  const authorizationHeader = req.get('authorization');

  const cookieToken = lucia.readSessionCookie(req.headers.cookie ?? '');
  const bearerToken = lucia.readBearerToken(authorizationHeader ?? '');
  const sessionId = cookieToken || bearerToken;

  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    res.appendHeader(
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    );
  }

  if (!session) {
    res.appendHeader(
      'Set-Cookie',
      lucia.createBlankSessionCookie().serialize(),
    );
  }

  res.locals.session = session;
  res.locals.user = user;

  return next();
};
