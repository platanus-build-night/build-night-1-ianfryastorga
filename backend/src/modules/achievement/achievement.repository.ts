import { Repository } from 'typeorm';
import { Achievement } from './achievement.entity';
import { AppDataSource } from '../../config/data-source';

export const AchievementRepo = AppDataSource.getRepository(Achievement).extend({
  async findAchievementById(id: number): Promise<Achievement | undefined> {
    return this.findOne({
      where: { id }
    });
  },

  async findAllAchievements(): Promise<Achievement[]> {
    return this.find();
  }
}); 