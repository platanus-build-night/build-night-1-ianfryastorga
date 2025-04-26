import { UserAnswer } from './user-answer.entity';
import { CreateUserAnswerDto, UpdateUserAnswerDto } from './user-answer.dto';
import { NotFoundError } from '../../common/errors';
import { UserRepo } from '../user/user.repository';
import { QuestionRepo } from '../question/question.repository';
import { UserAnswerRepo } from './user-answer.repository';
import { LevelRepo } from '../level/level.repository';

export class UserAnswerService {
  async createUserAnswer(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    // Verificar que el usuario existe
    const user = await UserRepo.findOneBy({ id: createUserAnswerDto.user_id });
    if (!user) {
      throw new NotFoundError(`User with ID ${createUserAnswerDto.user_id} not found`);
    }

    // Verificar que la pregunta existe
    const question = await QuestionRepo.findQuestionById(createUserAnswerDto.question_id);
    if (!question) {
      throw new NotFoundError(`Question with ID ${createUserAnswerDto.question_id} not found`);
    }

    // Verificar si ya existe una respuesta para esta pregunta y usuario
    const existingAnswer = await UserAnswerRepo.findByUserAndQuestion(
      createUserAnswerDto.user_id,
      createUserAnswerDto.question_id
    );

    // Si ya existe, incrementar el número de intentos
    if (existingAnswer) {
      const attemptNumber = existingAnswer.attemptNumber + 1;
      const updatedAnswer = await this.updateUserAnswer(existingAnswer.id, {
        user_answer: createUserAnswerDto.user_answer,
        is_correct: createUserAnswerDto.is_correct,
        attempt_number: attemptNumber,
        time_taken: createUserAnswerDto.time_taken
      });
      return updatedAnswer;
    }

    // Crear nueva respuesta de usuario
    const newUserAnswer = UserAnswerRepo.create({
      userId: createUserAnswerDto.user_id,
      questionId: createUserAnswerDto.question_id,
      userAnswer: createUserAnswerDto.user_answer,
      isCorrect: createUserAnswerDto.is_correct,
      attemptNumber: createUserAnswerDto.attempt_number || 1,
      timeTaken: createUserAnswerDto.time_taken
    });

    return UserAnswerRepo.save(newUserAnswer);
  }

  async updateUserAnswer(id: number, updateUserAnswerDto: UpdateUserAnswerDto): Promise<UserAnswer> {
    const userAnswer = await UserAnswerRepo.findOneBy({ id });
    
    if (!userAnswer) {
      throw new NotFoundError(`UserAnswer with ID ${id} not found`);
    }

    // Actualizar los campos especificados
    if (updateUserAnswerDto.user_answer !== undefined) {
      userAnswer.userAnswer = updateUserAnswerDto.user_answer;
    }
    if (updateUserAnswerDto.is_correct !== undefined) {
      userAnswer.isCorrect = updateUserAnswerDto.is_correct;
    }
    if (updateUserAnswerDto.attempt_number !== undefined) {
      userAnswer.attemptNumber = updateUserAnswerDto.attempt_number;
    }
    if (updateUserAnswerDto.time_taken !== undefined) {
      userAnswer.timeTaken = updateUserAnswerDto.time_taken;
    }
    
    return UserAnswerRepo.save(userAnswer);
  }

  async getUserAnswers(userId: string): Promise<UserAnswer[]> {
    // Verificar que el usuario existe
    const user = await UserRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    return UserAnswerRepo.findByUserId(userId);
  }

  async getQuestionAnswers(questionId: number): Promise<UserAnswer[]> {
    // Verificar que la pregunta existe
    const question = await QuestionRepo.findQuestionById(questionId);
    if (!question) {
      throw new NotFoundError(`Question with ID ${questionId} not found`);
    }

    return UserAnswerRepo.findByQuestionId(questionId);
  }

  async getUserProgress(userId: string): Promise<any> {
    // Verificar que el usuario existe
    const user = await UserRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    
    // Obtener todas las respuestas correctas del usuario
    const userAnswers = await UserAnswerRepo.find({
      where: { userId, isCorrect: true }
    });

    // Procesar las respuestas para obtener estadísticas por nivel/curso
    const progressByLevel: Record<number, {
      totalAnswered: number,
      questionIds: number[]
    }> = {};

    // Agrupar respuestas por nivel
    for (const answer of userAnswers) {
      // Obtener la pregunta para encontrar su nivel
      const question = await QuestionRepo.findQuestionById(answer.questionId);
      if (question) {
        if (!progressByLevel[question.levelId]) {
          progressByLevel[question.levelId] = {
            totalAnswered: 0,
            questionIds: []
          };
        }
        
        // Solo contar una vez cada pregunta respondida correctamente
        if (!progressByLevel[question.levelId].questionIds.includes(question.id)) {
          progressByLevel[question.levelId].questionIds.push(question.id);
          progressByLevel[question.levelId].totalAnswered++;
        }
      }
    }

    // Obtener el total de preguntas por nivel para calcular el progreso
    const progressDetails = await Promise.all(
      Object.keys(progressByLevel).map(async (levelIdStr) => {
        const levelId = parseInt(levelIdStr);
        const level = await LevelRepo.findLevelById(levelId);
        const totalQuestions = await QuestionRepo.count({ where: { levelId } });
        const answeredCorrectly = progressByLevel[levelId].totalAnswered;
        const progress = totalQuestions > 0 ? (answeredCorrectly / totalQuestions) * 100 : 0;
        
        return {
          levelId,
          levelTitle: level ? level.title : `Nivel ${levelId}`,
          totalQuestions,
          answeredCorrectly,
          progress: Math.round(progress),
          questionIds: progressByLevel[levelId].questionIds
        };
      })
    );

    // Calcular estadísticas generales
    const totalQuestionsAnswered = userAnswers.length;
    const uniqueQuestionsAnswered = new Set(userAnswers.map(a => a.questionId)).size;
    const totalCorrectAnswers = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = totalQuestionsAnswered > 0 ? (totalCorrectAnswers / totalQuestionsAnswered) * 100 : 0;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      overall: {
        totalQuestionsAnswered,
        uniqueQuestionsAnswered,
        totalCorrectAnswers,
        accuracy: Math.round(accuracy)
      },
      progressByLevel: progressDetails
    };
  }
} 