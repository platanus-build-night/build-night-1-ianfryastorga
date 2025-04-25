import { Router } from 'express';
import { AchievementController } from './achievement.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const achievementController = new AchievementController();
export const achievementRouter = Router();

// Rutas públicas (no requieren autenticación)
achievementRouter.get('/', achievementController.getAllAchievements);
achievementRouter.get('/:id', achievementController.getAchievement);

// Rutas que requieren autenticación
achievementRouter.use(authMiddleware);
achievementRouter.post('/', achievementController.createAchievement);
achievementRouter.put('/:id', achievementController.updateAchievement);
achievementRouter.delete('/:id', achievementController.deleteAchievement); 