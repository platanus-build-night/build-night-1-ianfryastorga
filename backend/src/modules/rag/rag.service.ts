import axios from 'axios';
import dotenv from 'dotenv';
import { CourseRepo } from '../course/course.repository';
import { SetRepo } from '../set/set.repository';
import { LevelRepo } from '../level/level.repository';
import { QuestionRepo } from '../question/question.repository';

dotenv.config();

export class RagService {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    if (!this.openaiApiKey) {
      console.warn('OPENAI_API_KEY no está configurada en el archivo .env');
    }
  }

  async generateCourseContext(courseId: number): Promise<string> {
    try {
      // Obtener información del curso
      const course = await CourseRepo.findOneBy({ id: courseId });
      if (!course) {
        throw new Error(`Curso con ID ${courseId} no encontrado`);
      }

      // Obtener conjuntos del curso
      const sets = await SetRepo.find({ where: { courseId } });

      // Construir contexto
      let context = `CURSO: ${course.title}\nDESCRIPCIÓN: ${course.description}\n\n`;

      // Agregar información de cada conjunto y nivel
      for (const set of sets) {
        context += `CONJUNTO: ${set.title}\nDESCRIPCIÓN: ${set.description}\n\n`;

        // Obtener niveles de este conjunto
        const levels = await LevelRepo.find({ where: { setId: set.id } });

        for (const level of levels) {
          context += `NIVEL: ${level.title}\nDESCRIPCIÓN: ${level.description}\n\n`;

          // Obtener preguntas de este nivel
          const questions = await QuestionRepo.find({ where: { levelId: level.id } });

          // Agregar preguntas y respuestas al contexto
          for (const question of questions) {
            context += `PREGUNTA: ${question.prompt}\n`;
            context += `RESPUESTA: ${question.answer}\n`;
            if (question.explanation) {
              context += `EXPLICACIÓN: ${question.explanation}\n`;
            }
            context += '\n';
          }
        }
      }

      return context;
    } catch (error) {
      console.error('Error al generar contexto del curso:', error);
      throw error;
    }
  }

  async answerQuestion(courseId: number, question: string, additionalContext: string = ''): Promise<string> {
    try {
      // Obtener el contexto del curso
      const courseContext = await this.generateCourseContext(courseId);

      // Añadir contexto personalizado si existe
      const completeContext = additionalContext 
        ? `${courseContext}\n\nCONTEXTO ADICIONAL:\n${additionalContext}` 
        : courseContext;

      // Formatear el mensaje para la API de OpenAI
      const systemMessage = `Eres un asistente educativo experto en el contenido del curso. 
      Utiliza el siguiente contexto para responder preguntas de los estudiantes de manera clara, 
      concisa y educativa. Si no encuentras la respuesta en el contexto, indícalo honestamente.

      CONTEXTO DEL CURSO:
      ${completeContext}`;

      // Llamar a la API de OpenAI
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-1106-preview', // Usando GPT-4.1 preview como solicitado
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: question }
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`
          }
        }
      );

      // Extraer y devolver la respuesta
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error al generar respuesta:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalles del error de API:', error.response.data);
      }
      throw new Error('No se pudo generar una respuesta. Por favor, intenta de nuevo más tarde.');
    }
  }
} 