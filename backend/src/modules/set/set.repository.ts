import { Repository } from 'typeorm';
import { Set } from './set.entity';
import { AppDataSource } from '../../config/data-source';

export const SetRepo = AppDataSource.getRepository(Set).extend({
  async findSetById(id: number): Promise<Set | undefined> {
    return this.findOne({
      where: { id }
    });
  },

  async findSetsByCourseId(courseId: number): Promise<Set[]> {
    return this.find({
      where: { courseId },
      order: { orderIndex: 'ASC' }
    });
  },

  async getNextOrderIndex(courseId: number): Promise<number> {
    const result = await this.createQueryBuilder('set')
      .select('MAX(set.order_index)', 'maxOrderIndex')
      .where('set.course_id = :courseId', { courseId })
      .getRawOne();
    
    return (result.maxOrderIndex || 0) + 1;
  }
}); 