import { NotificationType } from './notification.entity';

export class CreateNotificationDto {
  user_id: string;
  type: string;
  title: string;
  description: string;
  action_url?: string;
}

export class UpdateNotificationDto {
  is_read?: boolean;
}

export class NotificationResponseDto {
  id: number;
  user_id: string;
  type: string;
  title: string;
  description: string;
  is_read: boolean;
  action_url?: string;
  created_at: Date;
} 