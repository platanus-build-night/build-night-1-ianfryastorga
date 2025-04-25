import { Router } from 'express';
import { UserAchievementController } from './user-achievement.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const userAchievementController = new UserAchievementController();
export const userAchievementRouter = Router();

// Todas las rutas requieren autenticación
userAchievementRouter.use(authMiddleware);
userAchievementRouter.get('/user/:userId', userAchievementController.getUserAchievements);
userAchievementRouter.post('/', userAchievementController.unlockAchievement); 