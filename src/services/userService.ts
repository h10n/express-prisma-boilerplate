import {
  findUserById,
  findUsers,
  insertUser,
  deleteUser,
  updateUser,
  countUsers,
} from '@/repositories/userRepository';
import { TUserData, TUserQueryFilters } from '@/types/userType';

export const getUsers = async (filters: TUserQueryFilters) => {
  const totalCount = await countUsers(filters);

  const usersData = await findUsers(filters);
  return { data: usersData, total: totalCount || 0 };
};

export const getUserById = async (id: string) => {
  return await findUserById(id);
};

export const createUser = async (userData: TUserData) => {
  const createdUser = await insertUser(userData);

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
