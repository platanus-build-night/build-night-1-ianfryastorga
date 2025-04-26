import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('rag_documents')
export class RagDocument {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'course_id' })
  courseId!: number;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
} 