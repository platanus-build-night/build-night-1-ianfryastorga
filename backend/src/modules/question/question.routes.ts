import { Router } from 'express';
import { QuestionController } from './question.controller';

const questionController = new QuestionController();
export const questionRouter = Router();

// IMPORTANTE: Rutas específicas primero
// Ruta para obtener preguntas por nivel
questionRouter.get('/level/:levelId', questionController.getQuestionsByLevel);

// Rutas CRUD básicas para preguntas
questionRouter.post('/', questionController.createQuestion);
questionRouter.get('/:id', questionController.getQuestion);
questionRouter.put('/:id', questionController.updateQuestion);
questionRouter.delete('/:id', questionController.deleteQuestion); 