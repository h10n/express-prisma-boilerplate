import dotenv from 'dotenv';
import { z } from 'zod';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: envFile });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_NAME: z.string(),
  APP_URL: z.string().url(),
  APP_LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  APP_PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string().url(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  process.exit(1);
}

export const ENV = {
  NODE_ENV: env.data.NODE_ENV,
  APP_NAME: env.data.APP_NAME,
  APP_URL: env.data.APP_URL,
  APP_LOG_LEVEL: env.data.APP_LOG_LEVEL,
  APP_PORT: env.data.APP_PORT,
  DATABASE_URL: env.data.DATABASE_URL,
  FIREBASE_STORAGE_BUCKET: env.data.FIREBASE_STORAGE_BUCKET,
  FIREBASE_PROJECT_ID: env.data.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY: env.data.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: env.data.FIREBASE_CLIENT_EMAIL,
};
