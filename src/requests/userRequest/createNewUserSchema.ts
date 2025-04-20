import { z } from 'zod';

const getBodySchema = () => {
  const bodySchema = z
    .object({
      email: z
        .string({ required_error: 'Email is required.' })
        .trim()
        .toLowerCase()
        .email({ message: 'Invalid email address.' })
        .min(1, { message: 'Email is required.' })
        .max(255, { message: 'Email is too long.' }),
      password: z
        .string({ required_error: 'Password is required.' })
        .trim()
        .min(6, { message: 'Password must be at least 6 characters.' })
        .max(128, { message: 'Password is too long.' }),
      confirmPassword: z
        .string({ required_error: 'Confirm password is required.' })
        .trim()
        .min(1, { message: 'Confirm password is required.' }),
      roleId: z
        .string({ required_error: 'Role ID is required.' })
        .trim()
        .min(1, { message: 'Role ID is required.' })
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), {
          message: 'Role ID must be a valid number.',
        })
        .refine((val) => val > 0, {
          message: 'Role ID must be a positive integer.',
        })
        .refine((val) => Number.isInteger(val), {
          message: 'Role ID must be an integer.',
        }),
      firstName: z
        .string({ required_error: 'First name is required.' })
        .trim()
        .min(1, { message: 'First name is required.' })
        .max(255, { message: 'First name is too long.' }),
      lastName: z
        .string()
        .trim()
        .max(255, { message: 'Last name is too long.' })
        .optional(),
      birthDate: z
        .string({ required_error: 'Birth date is required.' })
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
          message:
            'Birth date must be in ISO-8601 format (YYYY-MM-DDTHH:mm:ss.SSSZ).',
        }),
      gender: z
        .string({ required_error: 'Gender is required.' })
        .trim()
        .min(1, { message: 'Gender is required.' })
        .max(50, { message: 'Gender is too long.' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    });

  return bodySchema;
};

export const createNewUserSchema = z.object({
  body: getBodySchema(),
});

export type TUserData = z.infer<typeof createNewUserSchema>['body'];
