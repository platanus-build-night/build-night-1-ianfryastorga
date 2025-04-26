import { Request, Response } from 'express';
import { UserAnswerService } from './user-answer.service';
import { CreateUserAnswerDto, UpdateUserAnswerDto } from './user-answer.dto';

export class UserAnswerController {
  private userAnswerService: UserAnswerService;

  constructor() {
    this.userAnswerService = new UserAnswerService();
  }

  createUserAnswer = async (req: Request, res: Response): Promise<void> => {
    const userAnswerData: CreateUserAnswerDto = req.body;
    
    const userAnswer = await this.userAnswerService.createUserAnswer(userAnswerData);
    res.status(201).json(userAnswer);
  };

  updateUserAnswer = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const userAnswerData: UpdateUserAnswerDto = req.body;
    
    const userAnswer = await this.userAnswerService.updateUserAnswer(id, userAnswerData);
    res.status(200).json(userAnswer);
  };

  getUserAnswers = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    
    const userAnswers = await this.userAnswerService.getUserAnswers(userId);
    res.status(200).json(userAnswers);
  };

  getQuestionAnswers = async (req: Request, res: Response): Promise<void> => {
    const questionId = parseInt(req.params.questionId);
    
    const questionAnswers = await this.userAnswerService.getQuestionAnswers(questionId);
    res.status(200).json(questionAnswers);
  };

  getUserProgress = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    
    const progress = await this.userAnswerService.getUserProgress(userId);
    res.status(200).json(progress);
  };
} 