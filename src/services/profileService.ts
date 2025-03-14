import { GenderEnum, Prisma } from '@prisma/client';

import { insertProfile } from '@/repositories/profileRepository';
import { TProfileData } from '@/types/profileType';
import stringToEnum from '@/utils/stringToEnum';

export const createProfile = async (
  profileData: TProfileData,
  tx?: Prisma.TransactionClient,
) => {
  const { gender, ...restProfileData } = profileData;

  const parsedGender = stringToEnum(gender, GenderEnum, GenderEnum.MALE);

  const createdProfile = await insertProfile(
    {
      userId: restProfileData.userId,
      firstName: restProfileData.firstName,
      lastName: restProfileData.lastName,
      gender: parsedGender,
      birthDate: restProfileData.birthDate,
    },
    tx,
  );

  return createdProfile;
};
