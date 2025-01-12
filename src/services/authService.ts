import { findUserByEmail } from '@/repositories/userRepository';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/config/lucia';

export const validateUserCredentials = async (
  email: string,
  password: string,
) => {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) return null;

  const isPasswordValid = await new Argon2id().verify(
    existingUser.password,
    password,
  );

  if (!isPasswordValid) return null;

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

  if (!existingUser) return null;

  const { password: _, ...userWithoutPassword } = existingUser;

  return userWithoutPassword;
};
