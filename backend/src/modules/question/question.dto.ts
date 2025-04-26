export class CreateQuestionDto {
  level_id: number;
  prompt: string;
  type: string;
  answer: string;
  options?: string;
  explanation?: string;
  difficulty: number;
}

export class UpdateQuestionDto {
  prompt?: string;
  type?: string;
  answer?: string;
  options?: string;
  explanation?: string;
  difficulty?: number;
}

export class QuestionResponseDto {
  id: number;
  level_id: number;
  prompt: string;
  type: string;
  answer: string;
  options: string;
  explanation: string;
  difficulty: number;
  created_at: Date;
  updated_at: Date;
} 