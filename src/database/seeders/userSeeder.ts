import { GenderEnum, PrismaClient } from '@prisma/client';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

export const userSeeder = async (prisma: PrismaClient) => {
  const dummyUsers = [
    {
      email: 'user1@example.com',
      roleId: 2,
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      email: 'user2@example.com',
      roleId: 2,
      firstName: 'Jane',
      lastName: 'Smith',
    },
    {
      email: 'user3@example.com',
      roleId: 2,
      firstName: 'Michael',
      lastName: 'Johnson',
    },
    {
      email: 'user4@example.com',
      roleId: 2,
      firstName: 'Emily',
      lastName: 'Davis',
    },
    {
      email: 'user5@example.com',
      roleId: 2,
      firstName: 'Chris',
      lastName: 'Brown',
    },
    {
      email: 'user6@example.com',
      roleId: 2,
      firstName: 'Anna',
      lastName: 'Wilson',
    },
    {
      email: 'user7@example.com',
      roleId: 2,
      firstName: 'David',
      lastName: 'Moore',
    },
    {
      email: 'user8@example.com',
      roleId: 2,
      firstName: 'Sophia',
      lastName: 'Anderson',
    },
    {
      email: 'user9@example.com',
      roleId: 2,
      firstName: 'James',
      lastName: 'Taylor',
    },
    {
      email: 'user10@example.com',
      roleId: 2,
      firstName: 'Olivia',
      lastName: 'Martinez',
    },
    {
      email: 'user11@example.com',
      roleId: 2,
      firstName: 'Daniel',
      lastName: 'Hernandez',
    },
    {
      email: 'user12@example.com',
      roleId: 2,
      firstName: 'Isabella',
      lastName: 'Lopez',
    },
    {
      email: 'user13@example.com',
      roleId: 2,
      firstName: 'Matthew',
      lastName: 'Gonzalez',
    },
    {
      email: 'user14@example.com',
      roleId: 2,
      firstName: 'Ava',
      lastName: 'Perez',
    },
    {
      email: 'user15@example.com',
      roleId: 2,
      firstName: 'Ethan',
      lastName: 'Thomas',
    },
    {
      email: 'user16@example.com',
      roleId: 2,
      firstName: 'Mia',
      lastName: 'White',
    },
    {
      email: 'user17@example.com',
      roleId: 2,
      firstName: 'Alexander',
      lastName: 'Harris',
    },
    {
      email: 'user18@example.com',
      roleId: 2,
      firstName: 'Charlotte',
      lastName: 'Clark',
    },
    {
      email: 'user19@example.com',
      roleId: 2,
      firstName: 'William',
      lastName: 'Lewis',
    },
    {
      email: 'user20@example.com',
      roleId: 2,
      firstName: 'Amelia',
      lastName: 'Walker',
    },
    {
      email: 'user21@example.com',
      roleId: 2,
      firstName: 'Joseph',
      lastName: 'Allen',
    },
    {
      email: 'user22@example.com',
      roleId: 2,
      firstName: 'Lily',
      lastName: 'Young',
    },
    {
      email: 'user23@example.com',
      roleId: 2,
      firstName: 'Benjamin',
      lastName: 'King',
    },
    {
      email: 'user24@example.com',
      roleId: 2,
      firstName: 'Zoe',
      lastName: 'Scott',
    },
    {
      email: 'user25@example.com',
      roleId: 2,
      firstName: 'Lucas',
      lastName: 'Green',
    },
    {
      email: 'user26@example.com',
      roleId: 2,
      firstName: 'Aria',
      lastName: 'Adams',
    },
    {
      email: 'user27@example.com',
      roleId: 2,
      firstName: 'Henry',
      lastName: 'Baker',
    },
    {
      email: 'user28@example.com',
      roleId: 2,
      firstName: 'Ellie',
      lastName: 'Nelson',
    },
    {
      email: 'user29@example.com',
      roleId: 2,
      firstName: 'Mason',
      lastName: 'Carter',
    },
    {
      email: 'user30@example.com',
      roleId: 2,
      firstName: 'Scarlett',
      lastName: 'Mitchell',
    },
    {
      email: 'user31@example.com',
      roleId: 2,
      firstName: 'Jack',
      lastName: 'Perez',
    },
    {
      email: 'user32@example.com',
      roleId: 2,
      firstName: 'Layla',
      lastName: 'Roberts',
    },
    {
      email: 'user33@example.com',
      roleId: 2,
      firstName: 'Logan',
      lastName: 'Evans',
    },
    {
      email: 'user34@example.com',
      roleId: 2,
      firstName: 'Chloe',
      lastName: 'Campbell',
    },
    {
      email: 'user35@example.com',
      roleId: 2,
      firstName: 'Owen',
      lastName: 'Morgan',
    },
    {
      email: 'user36@example.com',
      roleId: 2,
      firstName: 'Natalie',
      lastName: 'Reed',
    },
    {
      email: 'user37@example.com',
      roleId: 2,
      firstName: 'Gabriel',
      lastName: 'Stewart',
    },
    {
      email: 'user38@example.com',
      roleId: 2,
      firstName: 'Hannah',
      lastName: 'Sanders',
    },
    {
      email: 'user39@example.com',
      roleId: 2,
      firstName: 'Samuel',
      lastName: 'Morris',
    },
    {
      email: 'user40@example.com',
      roleId: 2,
      firstName: 'Leah',
      lastName: 'Foster',
    },
    {
      email: 'user41@example.com',
      roleId: 2,
      firstName: 'Elijah',
      lastName: 'Bailey',
    },
    {
      email: 'user42@example.com',
      roleId: 2,
      firstName: 'Samantha',
      lastName: 'Gray',
    },
    {
      email: 'user43@example.com',
      roleId: 2,
      firstName: 'Nathan',
      lastName: 'Bell',
    },
    {
      email: 'user44@example.com',
      roleId: 2,
      firstName: 'Lucy',
      lastName: 'Cooper',
    },
    {
      email: 'user45@example.com',
      roleId: 2,
      firstName: 'Dylan',
      lastName: 'Howard',
    },
    {
      email: 'user46@example.com',
      roleId: 2,
      firstName: 'Stella',
      lastName: 'Ward',
    },
    {
      email: 'user47@example.com',
      roleId: 2,
      firstName: 'Caleb',
      lastName: 'Torres',
    },
    {
      email: 'user48@example.com',
      roleId: 2,
      firstName: 'Eleanor',
      lastName: 'Murphy',
    },
    {
      email: 'user49@example.com',
      roleId: 2,
      firstName: 'Ryan',
      lastName: 'Rivera',
    },
    {
      email: 'user50@example.com',
      roleId: 2,
      firstName: 'Madeline',
      lastName: 'Cook',
    },
  ];

  const data = [
    {
      email: 'admin@kimhakim.my.id',
      roleId: 1,
      firstName: 'Super',
      lastName: 'Admin',
    },
    {
      email: 'hakim@kimhakim.my.id',
      roleId: 2,
      firstName: 'Hakim',
      lastName: 'User',
    },
    {
      email: 'nur@kimhakim.my.id',
      roleId: 2,
      firstName: 'Nur',
      lastName: 'User',
    },
    {
      email: 'nurhakim@kimhakim.my.id',
      roleId: 2,
      firstName: 'Nur',
      lastName: 'Hakim',
    },
    {
      email: 'h10n@kimhakim.my.id',
      roleId: 2,
      firstName: 'Hion',
      lastName: 'User',
    },
    {
      email: 'kim@kimhakim.my.id',
      roleId: 2,
      firstName: 'Kim',
      lastName: 'User',
    },
    {
      email: 'mikah@kimhakim.my.id',
      roleId: 2,
      firstName: 'Mikah',
      lastName: 'User',
    },
    {
      email: 'run@kimhakim.my.id',
      roleId: 2,
      firstName: 'Run',
      lastName: 'User',
    },
    {
      email: 'John@kimhakim.my.id',
      roleId: 2,
      firstName: 'John',
      lastName: 'User',
    },
    {
      email: 'doe@kimhakim.my.id',
      roleId: 2,
      firstName: 'Doe',
      lastName: 'User',
    },
    {
      email: 'kin@kimhakim.my.id',
      roleId: 2,
      firstName: 'Kin',
      lastName: 'User',
    },
    {
      email: 'kimu@kimhakim.my.id',
      roleId: 2,
      firstName: 'Kimu',
      lastName: 'User',
    },
    {
      email: 'light@kimhakim.my.id',
      roleId: 2,
      firstName: 'Light',
      lastName: 'User',
    },
    {
      email: 'wise@kimhakim.my.id',
      roleId: 2,
      firstName: 'Wise',
      lastName: 'User',
    },
    ...dummyUsers,
  ];

  for (let i = 0; i < data.length; i++) {
    const user = data[i];
    const id = generateId(50);
    const birthDate = new Date('1996-01-01 00:00:00');
    const gender = i % 2 === 0 ? GenderEnum.FEMALE : GenderEnum.MALE;

    const password = await new Argon2id().hash('admin123');
    const users = await prisma.user.upsert({
      where: { id },
      update: {
        email: user.email,
        password,
        roleId: user.roleId,
        profile: {
          update: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate,
            gender,
          },
        },
      },
      create: {
        id,
        email: user.email,
        password,
        roleId: user.roleId,
        profile: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate,
            gender,
          },
        },
      },
    });
    console.log({ users });
  }
};
