import { z } from 'zod';

const getBodySchema = () => {
  const bodySchema = z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email({ message: 'Invalid email address' })
      .min(1, { message: 'Email is required' })
      .max(255, { message: 'Email is too long' }),
    password: z
      .string({ required_error: 'Password is required' })
      .trim()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(128, { message: 'Password is too long' }),
  });

  return bodySchema;
};

export const loginSchema = z.object({
  body: getBodySchema(),
});
