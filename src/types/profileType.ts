import { GenderEnum } from '@prisma/client';

export type TProfileData = {
  userId: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
};

export type TProfileRepositoryData = Omit<TProfileData, 'gender'> & {
  gender: GenderEnum;
};
