import { Request, Response, Router } from 'express';

import userRouter from './userRoutes';
import { authRouter } from './authRoutes';
import { authorizeRole } from '@/middlewares/authRoleMiddleware';

const router = Router();
/**
 * @swagger
 * /api/health-check:
 *  get:
 *     tags:
 *     - Health Check
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */

router.get('/health-check', (_req: Request, res: Response) =>
  res.sendStatus(200),
);

router.use('/users', authorizeRole, userRouter);
router.use('/auth', authRouter);

export default router;
