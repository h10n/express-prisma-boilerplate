import { NextFunction, Request, Response } from 'express';

export const validateApiVersion = (minVersion: number) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const versionParam = req.version?.substring(1);
    const requestedVersion = parseInt(versionParam ?? '', 10);

    if (isNaN(requestedVersion) || requestedVersion < 1) {
      return next(new Error('Invalid API version requested.'));
    }

    if (requestedVersion >= minVersion) {
      return next();
    }

    return next('route');
  };
};
