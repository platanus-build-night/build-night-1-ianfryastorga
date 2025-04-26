import { Router } from 'express';
import { RagController } from './rag.controller';

export const ragRouter = Router();
const ragController = new RagController();

// Ruta para obtener respuestas a preguntas usando RAG
ragRouter.post('/answer', ragController.answerQuestion);

// Ruta para obtener el contexto de un curso (principalmente para depuración)
ragRouter.get('/context/:courseId', ragController.getCourseContext);

// Ruta para procesar archivos PDF (método tradicional)
ragRouter.post('/process-pdf', ragController.processPdf);

// Nueva ruta para procesar PDFs con OpenAI
ragRouter.post('/process-pdf-openai', ragController.processPdfWithOpenAI);

// Rutas para gestionar documentos RAG
ragRouter.post('/documents', ragController.createRagDocument);
ragRouter.put('/documents/:id', ragController.updateRagDocument);
ragRouter.delete('/documents/:id', ragController.deleteRagDocument);
ragRouter.get('/documents/course/:courseId', ragController.getRagDocumentsByCourse);
ragRouter.get('/documents/:id', ragController.getRagDocumentById);

// Nuevas rutas para gestionar vector store files
ragRouter.post('/vector-store/files', ragController.createVectorStoreFile);
ragRouter.get('/vector-store/files/:fileId', ragController.getVectorStoreFile); 