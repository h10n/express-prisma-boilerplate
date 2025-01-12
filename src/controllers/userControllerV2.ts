import { NextFunction, Request, Response } from 'express';
import { getUsers } from '@/services/userService';
import { StatusCodes } from 'http-status-codes';
import { TUserQueryFilters } from '@/types/userType';

export const getListUsersV2 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryFilters = req.query as TUserQueryFilters;
    const userList = await getUsers(queryFilters);

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'User list retrieved successfully (v2).',
      data: userList,
    });
  } catch (err) {
    return next(err);
  }
};
