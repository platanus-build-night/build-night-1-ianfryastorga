import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { StudyPlan } from './study-plan.entity';
import { Course } from '../course/course.entity';
import { Level } from '../level/level.entity';

@Entity('study_plan_items')
export class StudyPlanItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'study_plan_id' })
  studyPlanId: number;

  @ManyToOne(() => StudyPlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'study_plan_id' })
  studyPlan: StudyPlan;

  @Column({ name: 'course_id', nullable: true })
  courseId: number;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'level_id', nullable: true })
  levelId: number;

  @ManyToOne(() => Level, { nullable: true })
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'scheduled_date', type: 'text' })
  scheduledDate: Date;

  @Column({ nullable: true })
  duration: number;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 