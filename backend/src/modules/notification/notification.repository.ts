import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { AppDataSource } from '../../config/data-source';

export const NotificationRepo = AppDataSource.getRepository(Notification).extend({
  async findByUserId(userId: string, limit = 20, offset = 0): Promise<Notification[]> {
    return this.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    });
  },

  async countUnreadByUserId(userId: string): Promise<number> {
    return this.count({
      where: { 
        userId,
        isRead: false 
      }
    });
  },

  async markAllAsRead(userId: string): Promise<void> {
    await this.update(
      { userId, isRead: false },
      { isRead: true }
    );
  }
}); 