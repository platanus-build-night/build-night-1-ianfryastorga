import { Achievement } from './achievement.entity';
import { CreateAchievementDto, UpdateAchievementDto } from './achievement.dto';
import { NotFoundError } from '../../common/errors';
import { AchievementRepo } from './achievement.repository';

export class AchievementService {
  async createAchievement(createAchievementDto: CreateAchievementDto): Promise<Achievement> {
    const newAchievement = AchievementRepo.create({
      ...createAchievementDto,
      criteria: JSON.stringify(createAchievementDto.criteria)
    });

    return AchievementRepo.save(newAchievement);
  }

  async updateAchievement(id: number, updateAchievementDto: UpdateAchievementDto): Promise<Achievement> {
    const achievement = await AchievementRepo.findAchievementById(id);
    
    if (!achievement) {
      throw new NotFoundError(`Achievement with ID ${id} not found`);
    }

    // Convertir criteria a string JSON si se proporciona
    const updatedData = { ...updateAchievementDto };
    if (updatedData.criteria) {
      updatedData.criteria = JSON.stringify(updatedData.criteria);
    }

    const updatedAchievement = { ...achievement, ...updatedData };
    return AchievementRepo.save(updatedAchievement);
  }

  async getAchievementById(id: number): Promise<Achievement> {
    const achievement = await AchievementRepo.findAchievementById(id);
    
    if (!achievement) {
      throw new NotFoundError(`Achievement with ID ${id} not found`);
    }
    
    return achievement;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return AchievementRepo.findAllAchievements();
  }

  async deleteAchievement(id: number): Promise<void> {
    const achievement = await AchievementRepo.findAchievementById(id);
    
    if (!achievement) {
      throw new NotFoundError(`Achievement with ID ${id} not found`);
    }
    
    await AchievementRepo.remove(achievement);
  }
} 