import { GenderEnum } from '@prisma/client';

import {
  findUserById,
  findUsers,
  deleteUser,
  countUsers,
  findUserByEmail,
  insertUserWithProfile,
  updateUserWithProfile,
} from '@/repositories/userRepository';
import { TUserData, TUserQueryFilters } from '@/types/userType';
import stringToEnum from '@/utils/stringToEnum';
import { ValidationError } from '@/errors/ValidationError';
import { StatusCodes } from 'http-status-codes';

export const getUsers = async (filters: TUserQueryFilters) => {
  const totalCount = await countUsers(filters);

  const usersData = await findUsers(filters);
  return { users: usersData, total: totalCount || 0 };
};

export const getUserById = async (id: string) => {
  return await findUserById(id);
};

export const deleteUserById = async (id: string) => {
  // await getUserById(id);

  await deleteUser(id);
};

export const createUser = async (userData: TUserData) => {
  const { gender, roleId, ...restUserData } = userData;

  const isEmailExists = await checkUserExists(userData.email);

  if (isEmailExists) {
    throw new ValidationError(
      'This Email is already registered.',
      'EMAIL_ALREADY_EXISTS',
      StatusCodes.CONFLICT,
    );
  }

  const parsedGender = stringToEnum(gender, GenderEnum, GenderEnum.MALE);
  const parsedRoleId = Number(roleId) || 2;

  const createdUserWithProfile = await insertUserWithProfile({
    ...restUserData,
    gender: parsedGender,
    roleId: parsedRoleId,
  });

  return createdUserWithProfile;
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  const existingUser = await findUserByEmail(email);

  return !!existingUser;
};

export const updateUserById = async (userId: string, userData: TUserData) => {
  const { gender, roleId, ...restUserData } = userData;

  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new ValidationError(
      'User not found.',
      'USER_NOT_FOUND',
      StatusCodes.NOT_FOUND,
    );
  }

  if (userData.email && userData.email !== existingUser.email) {
    const isEmailTaken = await checkUserExists(userData.email);
    if (isEmailTaken) {
      throw new ValidationError(
        'This email is already registered.',
        'EMAIL_ALREADY_EXISTS',
        StatusCodes.CONFLICT,
      );
    }
  }

  const parsedGender = stringToEnum(gender, GenderEnum, GenderEnum.MALE);
  const parsedRoleId = Number(roleId) || 2;

  return await updateUserWithProfile(userId, {
    ...restUserData,
    gender: parsedGender,
    roleId: parsedRoleId,
  });
};
