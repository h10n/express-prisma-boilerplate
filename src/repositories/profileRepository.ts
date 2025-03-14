import prisma from '@/config/prisma';
import { TProfileRepositoryData } from '@/types/profileType';
import { Prisma } from '@prisma/client';

export const insertProfile = async (
  profileData: TProfileRepositoryData,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx || prisma;
  const profile = await client.profile.create({
    data: profileData,
  });

  return profile;
};
