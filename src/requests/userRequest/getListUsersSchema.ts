import { z } from 'zod';

const getQueryParamsSchema = () => {
  const rangeSchema = z.object(
    {
      start: z.string({ required_error: 'Range start is required' }),
      end: z.string({ required_error: 'Range end is required' }),
    },
    { required_error: 'Range is required' },
  );

  const sortBySchema = z.object({
    column: z.string({ required_error: 'SortBy column is required' }),
    order: z.string({ required_error: 'SortBy order is required' }),
  });

  const filterSchema = z.object({
    roles: z.string({ required_error: 'Filter roles is required' }),
    genders: z.string({ required_error: 'Filter genders is required' }),
    keywords: z.string({ required_error: 'Filter keywords is required' }),
  });

  const queryParamsSchema = z.object({
    range: rangeSchema,
    sortBy: sortBySchema.optional(),
    filter: filterSchema.partial().optional(),
  });

  return queryParamsSchema;
};

export const getListUsersSchema = z.object({
  query: getQueryParamsSchema(),
});
