import { DifficultyLevel } from './course.entity';

export class CreateCourseDto {
  title: string;
  description: string;
  thumbnail_url?: string;
  color?: string;
  difficulty_level?: string;
  estimated_duration?: number;
  is_published?: boolean;
}

export class UpdateCourseDto {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  color?: string;
  difficulty_level?: string;
  estimated_duration?: number;
  is_published?: boolean;
}

export class CourseResponseDto {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  color: string;
  difficulty_level: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  is_published: boolean;
  estimated_duration: number;
} 