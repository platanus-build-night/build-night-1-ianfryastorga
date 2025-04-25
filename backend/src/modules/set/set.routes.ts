import { Router } from 'express';
import { SetController } from './set.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const setController = new SetController();
export const setRouter = Router();

// Rutas públicas (no requieren autenticación)
setRouter.get('/:id', setController.getSet);
setRouter.get('/course/:courseId', setController.getSetsByCourse);

// Rutas que requieren autenticación
setRouter.use(authMiddleware);
setRouter.post('/', setController.createSet);
setRouter.put('/:id', setController.updateSet);
setRouter.delete('/:id', setController.deleteSet); 