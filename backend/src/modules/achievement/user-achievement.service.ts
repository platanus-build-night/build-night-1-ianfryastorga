import { UserAchievement } from './user-achievement.entity';
import { CreateUserAchievementDto } from './user-achievement.dto';
import { NotFoundError, BadRequestError } from '../../common/errors';
import { UserRepo } from '../user/user.repository';
import { UserAchievementRepo } from './user-achievement.repository';
import { AchievementRepo } from './achievement.repository';

export class UserAchievementService {
  async unlockAchievement(createUserAchievementDto: CreateUserAchievementDto): Promise<UserAchievement> {
    // Verificar que el logro existe
    const achievement = await AchievementRepo.findAchievementById(createUserAchievementDto.achievement_id);
    if (!achievement) {
      throw new NotFoundError(`Achievement with ID ${createUserAchievementDto.achievement_id} not found`);
    }

    // Verificar que el usuario existe
    const user = await UserRepo.findOneBy({ id: createUserAchievementDto.user_id });
    if (!user) {
      throw new NotFoundError(`User with ID ${createUserAchievementDto.user_id} not found`);
    }

    // Verificar que el usuario no tenga ya este logro
    const existingAchievement = await UserAchievementRepo.findByUserAndAchievement(
      createUserAchievementDto.user_id, 
      createUserAchievementDto.achievement_id
    );

    if (existingAchievement) {
      throw new BadRequestError(`User already has this achievement`);
    }

    // Crear el nuevo logro de usuario
    const newUserAchievement = UserAchievementRepo.create({
      userId: createUserAchievementDto.user_id,
      achievementId: createUserAchievementDto.achievement_id,
      unlockedAt: new Date()
    });

    return UserAchievementRepo.save(newUserAchievement);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    // Verificar que el usuario existe
    const user = await UserRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    return UserAchievementRepo.findByUserId(userId);
  }
} 