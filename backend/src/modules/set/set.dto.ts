export class CreateSetDto {
  course_id: number;
  title: string;
  description?: string;
  order_index?: number;
}

export class UpdateSetDto {
  title?: string;
  description?: string;
  order_index?: number;
}

export class SetResponseDto {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order_index: number;
  created_at: Date;
  updated_at: Date;
} 