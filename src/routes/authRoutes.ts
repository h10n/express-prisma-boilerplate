import express from 'express';
import { login, logout } from '@/controllers/authController';
import { loginSchema } from '@/requests/authRequest';
import { validateRequest } from '@/middlewares/requestValidatorMiddleware';

export const authRouter = express.Router();

authRouter.post('/login', validateRequest(loginSchema), login);

authRouter.post('/logout', logout);
