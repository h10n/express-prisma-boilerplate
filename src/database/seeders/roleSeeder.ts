import { PrismaClient } from '@prisma/client';

export const roleSeeder = async (prisma: PrismaClient) => {
  const data = [
    {
      id: 1,
      name: 'Admin',
    },
    {
      id: 2,
      name: 'User',
    },
  ];

  for (let i = 0; i < data.length; i++) {
    const role = data[i];
    const roles = await prisma.role.upsert({
      where: { name: role.name },
      update: {
        name: role.name,
      },
      create: {
        id: role.id,
        name: role.name,
      },
    });
    console.log({ roles });
  }
};
