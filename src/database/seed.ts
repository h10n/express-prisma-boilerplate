import { parseArgs } from 'node:util';
import { userSeeder } from './seeders/userSeeder';
import { PrismaClient } from '@prisma/client';
import { roleSeeder } from './seeders/roleSeeder';

interface ParseArgsOptionConfig {
  type: 'string' | 'boolean';
}

interface ParseArgsOptionsConfig {
  [key: string]: ParseArgsOptionConfig;
}

const prisma = new PrismaClient();

const options: ParseArgsOptionsConfig = {
  table: { type: 'string' },
};

const main = async () => {
  const {
    values: { table },
  } = parseArgs({ options });

  //! NOTE: Ensure the seeders are provided in the correct order to avoid errors in relationships.
  const seeders = [
    {
      name: 'role',
      func: async () => await roleSeeder(prisma),
    },
    {
      name: 'user',
      func: async () => await userSeeder(prisma),
    },
  ];

  if (!table) {
    for (let i = 0; i < seeders.length; i++) {
      const seeder = seeders[i];
      await seeder.func();
    }
  }

  if (table) {
    const selectedSeeder = seeders.find((seeder) => seeder.name === table);
    selectedSeeder && (await selectedSeeder.func());
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
