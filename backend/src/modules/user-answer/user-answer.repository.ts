import { AppDataSource } from '../../config/data-source';
import { UserAnswer } from './user-answer.entity';

export const UserAnswerRepo = AppDataSource.getRepository(UserAnswer).extend({
  async findByUserId(userId: string): Promise<UserAnswer[]> {
    return this.find({
      where: { userId },
      relations: ['question'],
    });
  },
  
  async findByQuestionId(questionId: number): Promise<UserAnswer[]> {
    return this.find({
      where: { questionId },
      relations: ['user'],
    });
  },
  
  async findByUserAndQuestion(userId: string, questionId: number): Promise<UserAnswer | null> {
    return this.findOne({
      where: { userId, questionId },
    });
  }
}); 