import express, { Express, NextFunction, Request } from 'express';
import cookieParser from 'cookie-parser';
import PinoHttp from 'pino-http';
import { logger } from '@/lib/pino';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/lib/swagger';

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

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

app.use(
  '/api/:version',
  authenticate,
  (req: Request, _res, next: NextFunction) => {
    req.version = req.params.version;
    next();
  },
  router,
);

app.use(logError);
app.use(handleError);

export default app;
