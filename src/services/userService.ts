import { Prisma } from '@prisma/client';

import prisma from '@/config/prisma';
import {
  findUserById,
  findUsers,
  insertUser,
  deleteUser,
  updateUser,
  countUsers,
} from '@/repositories/userRepository';
import { TUserData, TUserQueryFilters } from '@/types/userType';
import { createProfile } from './profileService';

export const getUsers = async (filters: TUserQueryFilters) => {
  const totalCount = await countUsers(filters);

  const usersData = await findUsers(filters);
  return { users: usersData, total: totalCount || 0 };
};

export const getUserById = async (id: string) => {
  return await findUserById(id);
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

export const deleteUserById = async (id: string) => {
  await getUserById(id);

  await deleteUser(id);
};

export const updateUserById = async (id: string, userData: TUserData) => {
  await getUserById(id);

  const updatedUser = await updateUser(id, userData);

  return updatedUser;
};

export const createUserWithProfile = async (userData: TUserData) => {
  return await prisma.$transaction(async (tx) => {
    try {
      const createdUser = await createUser(userData, tx);
      const { id: userId, password, ...restCreatedUser } = createdUser;
      const profileData = { ...userData, userId };
      const createdProfile = await createProfile(profileData, tx);

      return { ...restCreatedUser, ...createdProfile };
    } catch (err) {
      throw err;
    }
  });
};
