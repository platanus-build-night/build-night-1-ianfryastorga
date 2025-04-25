export class CreateUserAchievementDto {
  user_id: string;
  achievement_id: number;
}

export class UserAchievementResponseDto {
  id: number;
  user_id: string;
  achievement_id: number;
  unlocked_at: Date;
  achievement: {
    title: string;
    description: string;
    icon: string;
  };
} 