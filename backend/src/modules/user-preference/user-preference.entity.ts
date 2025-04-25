import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'email_notifications', default: true })
  emailNotifications: boolean;

  @Column({ name: 'push_notifications', default: true })
  pushNotifications: boolean;

  @Column({ name: 'weekly_reports', default: true })
  weeklyReports: boolean;

  @Column({ name: 'study_reminders', default: true })
  studyReminders: boolean;

  @Column({ name: 'dark_mode', default: false })
  darkMode: boolean;

  @Column({ default: 'es' })
  language: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 