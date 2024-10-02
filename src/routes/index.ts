import { Request, Response, Router } from 'express';

import userRouter from './userRoutes';
import { authRouter } from './authRoutes';
import { authorizeRole } from '@/middlewares/authRoleMiddleware';

const router = Router();

router.get('/health-check', (_req: Request, res: Response) =>
  res.sendStatus(200),
);

router.use('/users', authorizeRole, userRouter);
router.use('/auth', authRouter);

export default router;
