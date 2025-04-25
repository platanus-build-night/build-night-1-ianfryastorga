import { Repository } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';
import { AppDataSource } from '../../config/data-source';

export const UserAchievementRepo = AppDataSource.getRepository(UserAchievement).extend({
  async findByUserAndAchievement(userId: string, achievementId: number): Promise<UserAchievement | undefined> {
    return this.findOne({ 
      where: { 
        userId, 
        achievementId 
      } 
    });
  },

  async findByUserId(userId: string): Promise<UserAchievement[]> {
    return this.find({
      where: { userId },
      relations: ['achievement']
    });
  }
}); 