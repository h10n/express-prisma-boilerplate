import {
  createNewUser,
  deleteUser,
  getListUsers,
  updateUser,
} from '@/controllers/userController';
import { getListUsersV2 } from '@/controllers/userControllerV2';
import { validateRequest } from '@/middlewares/requestValidatorMiddleware';
import { validateApiVersion } from '@/middlewares/versionMiddleware';
import { getListUsersSchema } from '@/requests/userRequest';
import { Router } from 'express';

const userRouter = Router();
/** GET Methods */
/**
 * @swagger
 * '/api/users':
 *  get:
 *     tags:
 *     - User
 *     summary: Get users list
 *     parameters:
 *        - in: query
 *          name: range[start]
 *          schema:
 *            type: integer
 *            minimum: 0
 *          description: Start of the range
 *        - in: query
 *          name: range[end]
 *          schema:
 *            type: integer
 *          description: End of the range
 *        - in: query
 *          name: sortBy[column]
 *          schema:
 *            type: string
 *          description: Column to sort by
 *        - in: query
 *          name: sortBy[order]
 *          schema:
 *            type: string
 *            enum: [asc, desc]
 *          description: Sort order
 *        - in: query
 *          name: filter[roles]
 *          schema:
 *            type: integer
 *          description: Role filter
 *        - in: query
 *          name: filter[genders]
 *          schema:
 *            type: string
 *            enum: [MALE, FEMALE]
 *          description: Gender filter
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
userRouter.get(
  '/',
  validateApiVersion(2),
  validateRequest(getListUsersSchema),
  getListUsersV2,
);
userRouter.get('/', validateRequest(getListUsersSchema), getListUsers);
userRouter.post('/', createNewUser);
userRouter.delete('/:id', deleteUser);
userRouter.patch('/:id', updateUser);

export default userRouter;
