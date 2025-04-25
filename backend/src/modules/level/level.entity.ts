import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Set } from '../set/set.entity';

@Entity('levels')
export class Level {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'set_id' })
  setId: number;

  @ManyToOne(() => Set, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'set_id' })
  set: Set;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'order_index' })
  orderIndex: number;

  @Column({ name: 'theory_content', type: 'text', nullable: true })
  theoryContent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 