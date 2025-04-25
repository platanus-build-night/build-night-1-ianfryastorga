import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ForumThread } from './forum-thread.entity';

@Entity('forum_replies')
export class ForumReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'thread_id' })
  threadId: number;

  @ManyToOne(() => ForumThread, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'thread_id' })
  thread: ForumThread;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  votes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 