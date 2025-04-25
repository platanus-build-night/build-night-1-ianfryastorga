import { Request, Response } from 'express';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto, UpdateAchievementDto } from './achievement.dto';
import { ForbiddenError } from '../../common/errors';

export class AchievementController {
  private achievementService: AchievementService;

  constructor() {
    this.achievementService = new AchievementService();
  }

  createAchievement = async (req: Request, res: Response): Promise<void> => {
    // Verificar que el usuario es un administrador
    const isAdmin = (req as any).user.role === 'admin';
    if (!isAdmin) {
      throw new ForbiddenError('Only administrators can create achievements');
    }
    
    const achievementData: CreateAchievementDto = req.body;
    
    const achievement = await this.achievementService.createAchievement(achievementData);
    res.status(201).json(achievement);
  };

  updateAchievement = async (req: Request, res: Response): Promise<void> => {
    // Verificar que el usuario es un administrador
    const isAdmin = (req as any).user.role === 'admin';
    if (!isAdmin) {
      throw new ForbiddenError('Only administrators can update achievements');
    }
    
    const id = parseInt(req.params.id);
    const achievementData: UpdateAchievementDto = req.body;
    
    const achievement = await this.achievementService.updateAchievement(id, achievementData);
    res.status(200).json(achievement);
  };

  getAchievement = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const achievement = await this.achievementService.getAchievementById(id);
    res.status(200).json(achievement);
  };

  getAllAchievements = async (_req: Request, res: Response): Promise<void> => {
    const achievements = await this.achievementService.getAllAchievements();
    res.status(200).json(achievements);
  };

  deleteAchievement = async (req: Request, res: Response): Promise<void> => {
    // Verificar que el usuario es un administrador
    const isAdmin = (req as any).user.role === 'admin';
    if (!isAdmin) {
      throw new ForbiddenError('Only administrators can delete achievements');
    }
    
    const id = parseInt(req.params.id);
    
    await this.achievementService.deleteAchievement(id);
    res.status(204).send();
  };
} 