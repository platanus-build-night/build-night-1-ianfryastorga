import { Router } from 'express';
import { LevelController } from './level.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const levelController = new LevelController();
export const levelRouter = Router();

// IMPORTANTE: Rutas específicas primero
// Ruta para obtener niveles por conjunto
levelRouter.get('/set/:setId', levelController.getLevelsBySet);

// Rutas CRUD básicas para niveles
levelRouter.post('/', levelController.createLevel);
levelRouter.get('/:id', levelController.getLevel);
levelRouter.put('/:id', levelController.updateLevel);
levelRouter.delete('/:id', levelController.deleteLevel);

// Rutas que requieren autenticación
levelRouter.use(authMiddleware);
levelRouter.post('/', levelController.createLevel);
levelRouter.put('/:id', levelController.updateLevel);
levelRouter.delete('/:id', levelController.deleteLevel); 