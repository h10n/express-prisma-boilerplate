import { NextFunction, Request, Response } from 'express';
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from '@/services/userService';
import { StatusCodes } from 'http-status-codes';
import { TUserData, TUserQueryFilters } from '@/types/userType';

export const getListUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryFilters = req.query as TUserQueryFilters;
    const data = await getUsers(queryFilters);

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'User list retrieved successfully.',
      data,
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

    const data = await createUser(userData);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'A new user account has been created successfully.',
      data,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    const data = await getUserById(userId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'User data retrieved successfully.',
      data,
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
      status: 'success',
      message: 'The user account has been deleted successfully.',
      data: null,
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
      status: 'success',
      message: 'The user account has been updated successfully.',
      data: updatedUser,
    });
  } catch (err) {
    return next(err);
  }
};
