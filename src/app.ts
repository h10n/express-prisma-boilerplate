import express, { Express, NextFunction, Request } from 'express';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import PinoHttp from 'pino-http';
import compression from 'compression';
import hpp from 'hpp';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { StatusCodes } from 'http-status-codes';

import { logger } from '@/config/pino';
import { swaggerSpec } from '@/config/swagger';

import router from './routes';
import { authenticate } from './middlewares/authMiddleware';
import { handleError } from './middlewares/errorHandlerMiddleware';
import { logError } from './middlewares/errorLoggerMiddleware';
import { REQUEST_STATUSES } from './constants';

const app: Express = express();

// Security-related middlewares
app.use(cors());
app.use(hpp());
app.use(helmet());

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      status: REQUEST_STATUSES.FAIL,
      message: 'Too many requests, please try again later.',
      code: 'TOO_MANY_REQUESTS',
    }),
});
app.use(limiter);

// Logging middleware
app.use(
  PinoHttp({
    logger,
  }),
);

// Body parsing middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger documentation setup
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Version extraction and authentication middleware
app.use(
  '/api/:version',
  authenticate,
  (req: Request, _res, next: NextFunction) => {
    req.version = req.params.version;
    next();
  },
  router,
);

// Error handling
app.use(logError);
app.use(handleError);

export default app;
