import { Router } from 'express';
import { UserAnswerController } from './user-answer.controller';

export const userAnswerRouter = Router();
const userAnswerController = new UserAnswerController();

// Crear una nueva respuesta de usuario
userAnswerRouter.post('/', userAnswerController.createUserAnswer);

// Actualizar una respuesta existente
userAnswerRouter.put('/:id', userAnswerController.updateUserAnswer);

// Obtener todas las respuestas de un usuario
userAnswerRouter.get('/user/:userId', userAnswerController.getUserAnswers);

// Obtener todas las respuestas para una pregunta
userAnswerRouter.get('/question/:questionId', userAnswerController.getQuestionAnswers); 