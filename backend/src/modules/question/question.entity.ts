import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Level } from '../level/level.entity';

export enum QuestionType {
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multiple-choice',
  CODE = 'code'
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'level_id' })
  levelId: number;

  @ManyToOne(() => Level, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @Column({ type: 'text' })
  prompt: string;

  @Column({
    type: 'text',
    default: QuestionType.TEXT
  })
  type: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'json', nullable: true })
  options: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'int', default: 1 })
  difficulty: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 