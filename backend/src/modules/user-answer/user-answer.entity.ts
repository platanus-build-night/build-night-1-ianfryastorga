import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Question } from '../question/question.entity';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'question_id' })
  questionId: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ name: 'user_answer', type: 'text' })
  userAnswer: string;

  @Column({ name: 'is_correct' })
  isCorrect: boolean;

  @Column({ name: 'attempt_number', default: 1 })
  attemptNumber: number;

  @Column({ name: 'time_taken', nullable: true })
  timeTaken: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 