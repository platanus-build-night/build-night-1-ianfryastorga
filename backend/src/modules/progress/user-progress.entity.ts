import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';
import { Set } from '../set/set.entity';
import { Level } from '../level/level.entity';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'course_id' })
  courseId: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'set_id', nullable: true })
  setId: number;

  @ManyToOne(() => Set, { nullable: true })
  @JoinColumn({ name: 'set_id' })
  set: Set;

  @Column({ name: 'level_id', nullable: true })
  levelId: number;

  @ManyToOne(() => Level, { nullable: true })
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @Column({ default: false })
  completed: boolean;

  @Column({ name: 'progress_percentage', type: 'float', default: 0 })
  progressPercentage: number;

  @Column({ name: 'last_activity', type: 'text', nullable: true })
  lastActivity: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 