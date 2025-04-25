import { Router } from 'express';
import { LevelController } from './level.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const levelController = new LevelController();
export const levelRouter = Router();

// Rutas públicas (no requieren autenticación)
levelRouter.get('/:id', levelController.getLevel);
levelRouter.get('/set/:setId', levelController.getLevelsBySet);

// Rutas que requieren autenticación
levelRouter.use(authMiddleware);
levelRouter.post('/', levelController.createLevel);
levelRouter.put('/:id', levelController.updateLevel);
levelRouter.delete('/:id', levelController.deleteLevel); 