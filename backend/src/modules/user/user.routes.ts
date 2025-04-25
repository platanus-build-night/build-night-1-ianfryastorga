import { Router } from 'express';
import { userController } from './user.controller';

export const userRouter = Router();

userRouter.post('/', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/', userController.index);
