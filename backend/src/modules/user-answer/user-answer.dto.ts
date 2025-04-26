export interface CreateUserAnswerDto {
  user_id: string;
  question_id: number;
  user_answer: string;
  is_correct: boolean;
  attempt_number?: number;
  time_taken?: number;
}

export interface UpdateUserAnswerDto {
  user_answer?: string;
  is_correct?: boolean;
  attempt_number?: number;
  time_taken?: number;
} 