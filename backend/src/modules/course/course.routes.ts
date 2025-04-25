import { Router } from 'express';
import { CourseController } from './course.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const courseController = new CourseController();
export const courseRouter = Router();

// Rutas públicas (no requieren autenticación)
courseRouter.get('/', courseController.getAllCourses);
courseRouter.get('/:id', courseController.getCourse);

// Rutas que requieren autenticación
courseRouter.use(authMiddleware);
courseRouter.post('/', courseController.createCourse);
courseRouter.put('/:id', courseController.updateCourse);
courseRouter.delete('/:id', courseController.deleteCourse);
courseRouter.get('/user/me', courseController.getUserCourses); 