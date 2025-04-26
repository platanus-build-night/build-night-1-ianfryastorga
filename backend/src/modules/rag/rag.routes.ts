import { Router } from 'express';
import { RagController } from './rag.controller';

export const ragRouter = Router();
const ragController = new RagController();

// Ruta para obtener respuestas a preguntas usando RAG
ragRouter.post('/answer', ragController.answerQuestion);

// Ruta para obtener el contexto de un curso (principalmente para depuración)
ragRouter.get('/context/:courseId', ragController.getCourseContext); 