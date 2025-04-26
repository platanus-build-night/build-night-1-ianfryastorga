import { QuestionRepo } from './question.repository';
import { CreateQuestionDto, UpdateQuestionDto } from './question.dto';
import { Question } from './question.entity';
import { LevelRepo } from '../level/level.repository';
import { NotFoundError } from '../../common/errors';

export class QuestionService {
  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    // Verificar que el nivel existe
    const level = await LevelRepo.findLevelById(createQuestionDto.level_id);
    if (!level) {
      throw new NotFoundError(`Level with ID ${createQuestionDto.level_id} not found`);
    }
    
    // Crear la nueva pregunta
    const newQuestion = QuestionRepo.create({
      levelId: createQuestionDto.level_id,
      prompt: createQuestionDto.prompt,
      type: createQuestionDto.type,
      answer: createQuestionDto.answer,
      options: createQuestionDto.options || null,
      explanation: createQuestionDto.explanation || null,
      difficulty: createQuestionDto.difficulty
    });
    
    return QuestionRepo.save(newQuestion);
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const question = await QuestionRepo.findQuestionById(id);
    
    if (!question) {
      throw new NotFoundError(`Question with ID ${id} not found`);
    }

    const updatedQuestion = { 
      ...question, 
      prompt: updateQuestionDto.prompt !== undefined ? updateQuestionDto.prompt : question.prompt,
      type: updateQuestionDto.type !== undefined ? updateQuestionDto.type : question.type,
      answer: updateQuestionDto.answer !== undefined ? updateQuestionDto.answer : question.answer,
      options: updateQuestionDto.options !== undefined ? updateQuestionDto.options : question.options,
      explanation: updateQuestionDto.explanation !== undefined ? updateQuestionDto.explanation : question.explanation,
      difficulty: updateQuestionDto.difficulty !== undefined ? updateQuestionDto.difficulty : question.difficulty
    };
    
    return QuestionRepo.save(updatedQuestion);
  }

  async getQuestionById(id: number): Promise<Question> {
    const question = await QuestionRepo.findQuestionById(id);
    
    if (!question) {
      throw new NotFoundError(`Question with ID ${id} not found`);
    }
    
    return question;
  }

  async getQuestionsByLevelId(levelId: number): Promise<Question[]> {
    // Verificar que el nivel existe
    const level = await LevelRepo.findLevelById(levelId);
    if (!level) {
      throw new NotFoundError(`Level with ID ${levelId} not found`);
    }
    
    return QuestionRepo.findQuestionsByLevelId(levelId);
  }

  async deleteQuestion(id: number): Promise<void> {
    const question = await QuestionRepo.findQuestionById(id);
    
    if (!question) {
      throw new NotFoundError(`Question with ID ${id} not found`);
    }
    
    await QuestionRepo.remove(question);
  }
} 