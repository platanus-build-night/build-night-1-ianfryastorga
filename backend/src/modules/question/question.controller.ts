import { Request, Response } from 'express';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from './question.dto';

export class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  createQuestion = async (req: Request, res: Response): Promise<void> => {
    const questionData: CreateQuestionDto = req.body;
    
    const question = await this.questionService.createQuestion(questionData);
    res.status(201).json(question);
  };

  updateQuestion = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const questionData: UpdateQuestionDto = req.body;
    
    const question = await this.questionService.updateQuestion(id, questionData);
    res.status(200).json(question);
  };

  getQuestion = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const question = await this.questionService.getQuestionById(id);
    res.status(200).json(question);
  };

  getQuestionsByLevel = async (req: Request, res: Response): Promise<void> => {
    const levelId = parseInt(req.params.levelId);
    
    const questions = await this.questionService.getQuestionsByLevelId(levelId);
    res.status(200).json(questions);
  };

  deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.questionService.deleteQuestion(id);
    res.status(204).send();
  };
} 