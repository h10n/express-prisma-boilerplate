import {
  createNewUser,
  deleteUser,
  getListUsers,
  getUser,
  updateUser,
} from '@/controllers/userController';
import { getListUsersV2 } from '@/controllers/userControllerV2';
import { validateRequest } from '@/middlewares/requestValidatorMiddleware';
import { validateApiVersion } from '@/middlewares/versionMiddleware';
import { getListUsersSchema } from '@/requests/userRequest';
import { createNewUserSchema } from '@/requests/userRequest/createNewUserSchema';
import { updateUserSchema } from '@/requests/userRequest/updateUserSchema';
import { Router } from 'express';

const userRouter = Router();

userRouter.get(
  '/',
  validateApiVersion(2),
  validateRequest(getListUsersSchema),
  getListUsersV2,
);
userRouter.get('/', validateRequest(getListUsersSchema), getListUsers);
userRouter.post('/', validateRequest(createNewUserSchema), createNewUser);
userRouter.patch('/:id', validateRequest(updateUserSchema), updateUser);
userRouter.get('/:id', getUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
