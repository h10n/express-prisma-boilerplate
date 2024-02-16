import { z } from 'zod';

export const getListUsersSchema = z.object({
  query: z.object({
    test: z.string({ required_error: 'test is required' }),
  }),
});
