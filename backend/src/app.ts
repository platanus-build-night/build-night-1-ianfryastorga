import express from 'express';
import { json } from 'body-parser';
import { userRouter } from './modules/user/user.routes';
import { courseRouter } from './modules/course/course.routes';
import { setRouter } from './modules/set/set.routes';
import { levelRouter } from './modules/level/level.routes';
import { achievementRouter } from './modules/achievement/achievement.routes';
import { userAchievementRouter } from './modules/achievement/user-achievement.routes';
import { errorHandler } from './common/error.middleware';

export const app = express();
app.use(json());

app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/sets', setRouter);
app.use('/api/levels', levelRouter);
app.use('/api/achievements', achievementRouter);
app.use('/api/user-achievements', userAchievementRouter);

app.use(errorHandler);
