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
    {
      id: generateId(50),
      email: 'nur@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Nur',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.FEMALE,
    },
    {
      id: generateId(50),
      email: 'nurhakim@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Nur',
      lastName: 'Hakim',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },

    {
      id: generateId(50),
      email: 'h10n@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Hion',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
    {
      id: generateId(50),
      email: 'kim@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Kim',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
    {
      id: generateId(50),
      email: 'mikah@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Mikah',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.FEMALE,
    },
    {
      id: generateId(50),
      email: 'run@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Run',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
    {
      id: generateId(50),
      email: 'John@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'John',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
    {
      id: generateId(50),
      email: 'doe@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Doe',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
    {
      id: generateId(50),
      email: 'kin@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Kin',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.FEMALE,
    },
    {
      id: generateId(50),
      email: 'kimu@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Kimu',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
    {
      id: generateId(50),
      email: 'light@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Light',
      lastName: 'User',
      birthDate: new Date('1996-01-01 00:00:00'),
      gender: GenderEnum.MALE,
    },
    {
      id: generateId(50),
      email: 'wise@kimhakim.my.id',
      password: await new Argon2id().hash('admin123'),
      roleId: 2,
      firstName: 'Wise',
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
