import { Request, Response } from 'express';
import { UserAchievementService } from './user-achievement.service';
import { CreateUserAchievementDto } from './user-achievement.dto';
import { ForbiddenError } from '../../common/errors';

export class UserAchievementController {
  private userAchievementService: UserAchievementService;

  constructor() {
    this.userAchievementService = new UserAchievementService();
  }

  unlockAchievement = async (req: Request, res: Response): Promise<void> => {
    // Solo administradores pueden desbloquear logros manualmente
    const isAdmin = (req as any).user.role === 'admin';
    if (!isAdmin) {
      throw new ForbiddenError('Only administrators can unlock achievements manually');
    }
    
    const achievementData: CreateUserAchievementDto = req.body;
    
    const userAchievement = await this.userAchievementService.unlockAchievement(achievementData);
    res.status(201).json(userAchievement);
  };

  getUserAchievements = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    
    // Verificar que el usuario está accediendo a sus propios logros o es admin
    const currentUser = (req as any).user;
    const isOwnProfile = currentUser.id === userId;
    const isAdmin = currentUser.role === 'admin';
    
    if (!isOwnProfile && !isAdmin) {
      throw new ForbiddenError('You can only view your own achievements');
    }
    
    const achievements = await this.userAchievementService.getUserAchievements(userId);
    res.status(200).json(achievements);
  };
} 