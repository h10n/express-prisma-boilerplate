import { PrismaClient } from '@prisma/client';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

export const userSeeder = async (prisma: PrismaClient) => {
  enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
  }

  const data = [
    {
      id: generateId(50),
      email: 'admin@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 1,
      firstName: 'Super',
      lastName: 'Admin',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
    {
      id: generateId(50),
      email: 'hakim@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Hakim',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
  ];

  for (let i = 0; i < data.length; i++) {
    const user = data[i];
    const users = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        password: user.password,
        roleId: user.roleId,
        profile: {
          update: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            gender: user.gender,
          },
        },
      },
      create: {
        id: user.id,
        email: user.email,
        password: user.password,
        roleId: user.roleId,
        profile: {
          create: {
            id: i + 1,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            gender: user.gender,
          },
        },
      },
    });
    console.log({ users });
  }
};
