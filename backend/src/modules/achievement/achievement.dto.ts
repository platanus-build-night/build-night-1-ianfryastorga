export class CreateAchievementDto {
  title: string;
  description: string;
  icon: string;
  criteria: object;
}

export class UpdateAchievementDto {
  title?: string;
  description?: string;
  icon?: string;
  criteria?: object;
}

export class AchievementResponseDto {
  id: number;
  title: string;
  description: string;
  icon: string;
  criteria: object;
  created_at: Date;
  updated_at: Date;
} 