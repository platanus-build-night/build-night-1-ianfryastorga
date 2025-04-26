import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { AppDataSource } from '../../config/data-source';

export const QuestionRepo = AppDataSource.getRepository(Question).extend({
  async findQuestionById(id: number): Promise<Question | undefined> {
    return this.findOne({
      where: { id }
    });
  },

  async findQuestionsByLevelId(levelId: number): Promise<Question[]> {
    return this.find({
      where: { levelId },
      order: { difficulty: 'ASC' }
    });
  }
}); 