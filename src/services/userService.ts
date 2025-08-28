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
import { uploadProfilePicture } from '@/utils/fileUploadUtils';
import { FileUploadError } from '@/errors/FileUploadError';
import { generateSignedUrl } from './fileUploadService';

export const getUsers = async (filters: TUserQueryFilters) => {
  const [totalCount, usersData] = await Promise.all([
    countUsers(filters),
    findUsers(filters),
  ]);

  const resolveAvatarUrl = async (url?: string | null) => {
    if (!url) return null;
    try {
      return await generateSignedUrl(url);
    } catch {
      return null;
    }
  };

  const usersWithAvatars = await Promise.all(
    usersData.map(async (user) => {
      const avatarUrl = await resolveAvatarUrl(user.profile?.avatarUrl);

      return {
        ...user,
        profile: {
          ...user.profile,
          avatarUrl,
        },
      };
    }),
  );

  return {
    users: usersWithAvatars,
    total: totalCount ?? 0,
  };
};

export const getUserById = async (id: string) => {
  return await findUserById(id);
};

export const deleteUserById = async (id: string) => {
  // await getUserById(id);

  await deleteUser(id);
};

export const createUser = async (userData: TUserData) => {
  const { gender, roleId, profilePicture, ...restUserData } = userData;

  const existingUser = await findUserByEmail(userData.email);
  const isEmailExists = !!existingUser;

  if (isEmailExists) {
    throw new ValidationError(
      'This Email is already registered.',
      'EMAIL_ALREADY_EXISTS',
      StatusCodes.CONFLICT,
    );
  }

  const parsedGender = stringToEnum(gender, GenderEnum, GenderEnum.MALE);
  const parsedRoleId = Number(roleId) || 2;

  let avatarUrl: string | undefined;
  if (profilePicture) {
    try {
      const uploadResult = await uploadProfilePicture(profilePicture);
      avatarUrl = uploadResult.fullPath;
    } catch (error) {
      if (error instanceof FileUploadError) {
        throw new ValidationError(
          `Profile picture upload failed: ${error.message}`,
          'PROFILE_PICTURE_UPLOAD_FAILED',
          StatusCodes.BAD_REQUEST,
        );
      }
      throw new ValidationError(
        'Profile picture upload failed',
        'PROFILE_PICTURE_UPLOAD_FAILED',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  const createdUserWithProfile = await insertUserWithProfile({
    ...restUserData,
    gender: parsedGender,
    roleId: parsedRoleId,
    avatarUrl,
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
