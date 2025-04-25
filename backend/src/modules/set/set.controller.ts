import { Request, Response } from 'express';
import { SetService } from './set.service';
import { CreateSetDto, UpdateSetDto } from './set.dto';

export class SetController {
  private setService: SetService;

  constructor() {
    this.setService = new SetService();
  }

  createSet = async (req: Request, res: Response): Promise<void> => {
    const setData: CreateSetDto = req.body;
    
    const set = await this.setService.createSet(setData);
    res.status(201).json(set);
  };

  updateSet = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const setData: UpdateSetDto = req.body;
    
    const set = await this.setService.updateSet(id, setData);
    res.status(200).json(set);
  };

  getSet = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const set = await this.setService.getSetById(id);
    res.status(200).json(set);
  };

  getSetsByCourse = async (req: Request, res: Response): Promise<void> => {
    const courseId = parseInt(req.params.courseId);
    
    const sets = await this.setService.getSetsByCourseId(courseId);
    res.status(200).json(sets);
  };

  deleteSet = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.setService.deleteSet(id);
    res.status(204).send();
  };
} 