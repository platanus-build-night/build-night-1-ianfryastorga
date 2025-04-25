export class CreateLevelDto {
  set_id: number;
  title: string;
  description?: string;
  theory_content?: string;
  order_index?: number;
}

export class UpdateLevelDto {
  title?: string;
  description?: string;
  theory_content?: string;
  order_index?: number;
}

export class LevelResponseDto {
  id: number;
  set_id: number;
  title: string;
  description: string;
  theory_content: string;
  order_index: number;
  created_at: Date;
  updated_at: Date;
} 