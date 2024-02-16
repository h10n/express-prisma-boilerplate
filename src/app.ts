import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import PinoHttp from 'pino-http';

import { logger } from '@/lib/pino';
import router from './routes';
import { authenticate } from './middlewares/authMiddleware';
import { handleError } from './middlewares/errorHandlerMiddleware';
import { logError } from './middlewares/errorLoggerMiddleware';

const app: Express = express();

app.use(
  PinoHttp({
    logger,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', authenticate, router);

app.use(logError);
app.use(handleError);

export default app;
