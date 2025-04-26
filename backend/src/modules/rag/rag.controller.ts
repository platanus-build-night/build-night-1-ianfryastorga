import { Request, Response } from 'express';
import { RagService } from './rag.service';

export class RagController {
  private ragService: RagService;

  constructor() {
    this.ragService = new RagService();
  }

  answerQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, question, additionalContext } = req.body;
      
      if (!courseId || !question) {
        res.status(400).json({ error: 'Se requiere courseId y question' });
        return;
      }

      const answer = await this.ragService.answerQuestion(
        parseInt(courseId), 
        question,
        additionalContext || ''
      );
      res.status(200).json({ answer });
    } catch (error) {
      console.error('Error en el controlador RAG:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al procesar la consulta' 
      });
    }
  };

  getCourseContext = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = parseInt(req.params.courseId);
      
      if (isNaN(courseId)) {
        res.status(400).json({ error: 'ID de curso inválido' });
        return;
      }

      const context = await this.ragService.generateCourseContext(courseId);
      res.status(200).json({ context });
    } catch (error) {
      console.error('Error al obtener contexto del curso:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al obtener el contexto' 
      });
    }
  };
} 