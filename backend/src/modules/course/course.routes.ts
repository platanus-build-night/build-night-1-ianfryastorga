import { Router } from 'express';
import { CourseController } from './course.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const courseController = new CourseController();
export const courseRouter = Router();

// Rutas públicas (no requieren autenticación)
courseRouter.get('/', courseController.getAllCourses);

// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros
courseRouter.get('/user/me', courseController.getUserCourses);

// Rutas con parámetros
courseRouter.get('/:id', courseController.getCourse);

// Rutas que requieren autenticación
courseRouter.post('/', courseController.createCourse);
courseRouter.put('/:id', courseController.updateCourse);
courseRouter.delete('/:id', courseController.deleteCourse); 