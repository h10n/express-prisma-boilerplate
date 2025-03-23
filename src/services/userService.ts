import { GenderEnum, Prisma } from '@prisma/client';

import {
  findUserById,
  findUsers,
  insertUser,
  deleteUser,
  updateUser,
  countUsers,
  findUserByEmail,
  insertUserWithProfile,
} from '@/repositories/userRepository';
import { TUserData, TUserQueryFilters } from '@/types/userType';
import stringToEnum from '@/utils/stringToEnum';

export const getUsers = async (filters: TUserQueryFilters) => {
  const totalCount = await countUsers(filters);

  const usersData = await findUsers(filters);
  return { users: usersData, total: totalCount || 0 };
};

export const createUser = async (
  userData: TUserData,
  tx?: Prisma.TransactionClient,
) => {
  const { roleId, ...restUserData } = userData;

  const parsedRoleId = Number(roleId) || 2;

  const createdUser = await insertUser(
    {
      ...restUserData,
      roleId: parsedRoleId,
    },
    tx,
  );

  return createdUser;
};

export const getUserById = async (id: string) => {
  return await findUserById(id);
};

export const deleteUserById = async (id: string) => {
  // await getUserById(id);

  await deleteUser(id);
};

export const updateUserById = async (id: string, userData: TUserData) => {
  // await getUserById(id);

  const updatedUser = await updateUser(id, userData);

  return updatedUser;
};

export const createUserWithProfile = async (userData: TUserData) => {
  const { gender, roleId, ...restUserData } = userData;

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
