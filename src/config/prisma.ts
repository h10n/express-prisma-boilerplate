import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  name: 'softDelete',
  model: {
    $allModels: {
      async delete<M, A>(
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

      // async findMany(this: any, args?: { where?: Record<string, any> }) {
      //   const context = Prisma.getExtensionContext(this);
      //   const newArgs = {
      //     ...args,
      //     where: {
      //       ...args?.where,
      //       deleted: false,
      //     },
      //   };
      //   return context.findMany(newArgs);
      // },

      // async findFirst(this: any, args?: { where?: Record<string, any> }) {
      //   const context = Prisma.getExtensionContext(this);
      //   const newArgs = {
      //     ...args,
      //     where: {
      //       ...args?.where,
      //       deleted: false,
      //     },
      //   };
      //   return context.findFirst(newArgs);
      // },
    },
  },

  query: {
    $allModels: {
      // async update({
      //   args,
      //   query,
      // }: {
      //   args: { where?: Record<string, unknown> };
      //   query: (args: any) => Promise<any>;
      // }) {
      //   if (args.where && typeof args.where === 'object') {
      //     args.where = { ...args.where, deleted: false };
      //   }
      //   return query(args);
      // },
    },
  },
});

export default prisma;
