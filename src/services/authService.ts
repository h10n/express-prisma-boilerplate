import { findUserByEmail } from '@/repositories/userRepository';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/config/lucia';
import { ValidationError } from '@/errors/ValidationError';
import { StatusCodes } from 'http-status-codes';

export const validateUserCredentials = async (
  email: string,
  password: string,
) => {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new ValidationError(
      'User not exists or email is incorrect.',
      'INVALID_CREDENTIALS',
      StatusCodes.UNAUTHORIZED,
    );
  }

  const isPasswordValid = await new Argon2id().verify(
    existingUser.password,
    password,
  );

  if (!isPasswordValid) {
    throw new ValidationError(
      'Incorrect email or password.',
      'INVALID_CREDENTIALS',
      StatusCodes.UNAUTHORIZED,
    );
  }

  const { password: _, ...userWithoutPassword } = existingUser;

  return userWithoutPassword;
};

export const createUserSession = async (userId: string) => {
  await lucia.invalidateUserSessions(userId);

  const session = await lucia.createSession(userId, {});
  const cookie = lucia.createSessionCookie(session.id).serialize();

  return { token: session.id, cookie };
};

export const getUserSession = async (email: string) => {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new ValidationError(
      'User data not found.',
      'USER_DATA_NOT_FOUND',
      StatusCodes.UNAUTHORIZED,
    );
  }

  const { password: _, ...userWithoutPassword } = existingUser;

  return userWithoutPassword;
};

export const checkUserSession = async (session: any, user: any) => {
  if (!session || !user) {
    throw new ValidationError(
      'Session or user not found.',
      'SESSION_OR_USER_NOT_FOUND',
      StatusCodes.UNAUTHORIZED,
    );
  }
};
