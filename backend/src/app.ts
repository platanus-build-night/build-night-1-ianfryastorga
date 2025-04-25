import express from 'express';
import { json } from 'body-parser';
import { userRouter } from './modules/user/user.routes';
import { errorHandler } from './common/error.middleware';

export const app = express();
app.use(json());

app.use('/api/users', userRouter);

app.use(errorHandler);
