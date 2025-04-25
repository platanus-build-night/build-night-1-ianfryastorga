import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { SQLiteCreateDateColumn, SQLiteUpdateDateColumn } from '../../entities.helper';

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  thumbnail_url: string;

  @Column({ nullable: true })
  color: string;

  @Column({
    type: 'text',
    default: DifficultyLevel.BEGINNER
  })
  difficulty_level: string;

  @Column({ name: 'created_by' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @SQLiteCreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @SQLiteUpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: false })
  is_published: boolean;

  @Column({ nullable: true })
  estimated_duration: number;
} 