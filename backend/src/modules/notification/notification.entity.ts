import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum NotificationType {
  ACHIEVEMENT = 'achievement',
  COURSE = 'course',
  REMINDER = 'reminder',
  SOCIAL = 'social'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'text'
  })
  type: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'action_url', nullable: true })
  actionUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 