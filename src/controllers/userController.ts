import { NextFunction, Request, Response } from 'express';
import {
  createUser,
  deleteUserById,
  getUsers,
  updateUserById,
} from '@/services/userService';
import { StatusCodes } from 'http-status-codes';
import { TUserData, TUserQueryFilters } from 'types/userType';

export const getListUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryFilters = req.query as TUserQueryFilters;
    const userList = await getUsers(queryFilters);

    res.status(StatusCodes.OK).json({
      message: 'Get users list successfully',
      data: userList,
    });
  } catch (err) {
    return next(err);
  }
};

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.body as TUserData;
    const createdUser = await createUser(userData);

    res.status(StatusCodes.CREATED).json({
      message: 'new user created successfully',
      data: createdUser,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    await deleteUserById(userId);

    res.status(StatusCodes.OK).json({
      message: 'user deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    const userData = req.body as TUserData;

    const updatedUser = await updateUserById(userId, userData);

    res.status(StatusCodes.OK).json({
      message: 'existing user updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    return next(err);
  }
};
