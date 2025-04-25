import { Request, Response } from 'express';
import { LevelService } from './level.service';
import { CreateLevelDto, UpdateLevelDto } from './level.dto';

export class LevelController {
  private levelService: LevelService;

  constructor() {
    this.levelService = new LevelService();
  }

  createLevel = async (req: Request, res: Response): Promise<void> => {
    const levelData: CreateLevelDto = req.body;
    
    const level = await this.levelService.createLevel(levelData);
    res.status(201).json(level);
  };

  updateLevel = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const levelData: UpdateLevelDto = req.body;
    
    const level = await this.levelService.updateLevel(id, levelData);
    res.status(200).json(level);
  };

  getLevel = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const level = await this.levelService.getLevelById(id);
    res.status(200).json(level);
  };

  getLevelsBySet = async (req: Request, res: Response): Promise<void> => {
    const setId = parseInt(req.params.setId);
    
    const levels = await this.levelService.getLevelsBySetId(setId);
    res.status(200).json(levels);
  };

  deleteLevel = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.levelService.deleteLevel(id);
    res.status(204).send();
  };
} 