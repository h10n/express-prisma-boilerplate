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
import { uploadSingle } from '@/middlewares/fileUploadMiddleware';
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

userRouter.post(
  '/',
  uploadSingle('profilePicture', {
    maxSize: 5 * 1024 * 1024,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  }),
  validateRequest(createNewUserSchema),
  createNewUser,
);

userRouter.patch(
  '/:id',
  uploadSingle('profilePicture', {
    maxSize: 5 * 1024 * 1024,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  }),
  validateRequest(updateUserSchema),
  updateUser,
);
userRouter.get('/:id', getUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
