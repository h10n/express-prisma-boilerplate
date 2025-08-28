import { PrismaClient, Prisma } from '@prisma/client';

const addDeletedFilter = (args: { where?: Record<string, unknown> }) => {
  args.where = { ...(args.where || {}), deleted: false };
  return args;
};

const prisma = new PrismaClient().$extends({
  name: 'softDelete',
  model: {
    $allModels: {
      async softDelete<M, A>(
        this: M,
        where: Prisma.Args<M, 'delete'>,
      ): Promise<Prisma.Result<M, A, 'update'>> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).update({
          ...where,
          data: {
            deleted: true,
            deletedAt: new Date(),
          },
        });
      },
    },
  },

  query: {
    $allModels: {
      async upsert({
        args,
        query,
      }: {
        args: { where?: Record<string, unknown> };
        query: (args: any) => Promise<any>;
      }) {
        return query(addDeletedFilter(args));
      },

      async update({
        args,
        query,
      }: {
        args: { where?: Record<string, unknown> };
        query: (args: any) => Promise<any>;
      }) {
        return query(addDeletedFilter(args));
      },

      async findMany({
        args,
        query,
      }: {
        args: { where?: Record<string, unknown> };
        query: (args: any) => Promise<any>;
      }) {
        return query(addDeletedFilter(args));
      },

      async findUnique({
        args,
        query,
      }: {
        args: { where?: Record<string, unknown> };
        query: (args: any) => Promise<any>;
      }) {
        return query(addDeletedFilter(args));
      },

      async count({
        args,
        query,
      }: {
        args: { where?: Record<string, unknown> };
        query: (args: any) => Promise<any>;
      }) {
        return query(addDeletedFilter(args));
      },
    },
  },
});

export default prisma;
