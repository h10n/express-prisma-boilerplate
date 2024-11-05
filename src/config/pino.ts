import { APP_ENV } from '@/constants';
import { ENV } from '@/config/environment';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

const pinoOptions = () => {
  const date = new Date().toISOString().split('T')[0];

  const defaultOptions = {
    level: ENV.APP_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  if (ENV.NODE_ENV === APP_ENV.PRODUCTION) {
    return {
      ...defaultOptions,
      transport: {
        target: 'pino/file',
        options: {
          destination: `${process.cwd()}/logs/${date}.log`,
          mkdir: true,
        },
      },
    };
  }

  if (ENV.NODE_ENV === APP_ENV.DEVELOPMENT) {
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
