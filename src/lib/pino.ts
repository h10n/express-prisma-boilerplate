import { APP_ENV } from '@/constants';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

const pinoOptions = () => {
  const date = new Date().toISOString().split('T')[0];

  const defaultOptions = {
    level: process.env.APP_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  if (process.env.APP_ENV === APP_ENV.PRODUCTION) {
    return {
      ...defaultOptions,
      transport: {
        target: 'pino/file',
        options: {
          destination: `${process.cwd()}/src/storage/logs/${date}.log`,
          mkdir: true,
        },
      },
    };
  }

  if (process.env.APP_ENV === APP_ENV.DEVELOPMENT) {
    return {
      ...defaultOptions,
      transport: {
        target: 'pino-pretty',
        options: {
          destination: process.stdout.fd,
        },
      },
    };
  }

  return defaultOptions;
};

export const logger = pino(pinoOptions());
