import { NextFunction, Request, Response } from 'express';

export const versionMiddleware = (version: number) => {
  return function (req: Request, _res: Response, next: NextFunction) {
    const requestVersion = parseInt(req.version.substring(1));
    if (typeof requestVersion !== 'number') {
      return next(new Error('Invalid API version requested.'));
    } else if (requestVersion >= version) {
      return next();
    }
    return next('route');
  };
};
