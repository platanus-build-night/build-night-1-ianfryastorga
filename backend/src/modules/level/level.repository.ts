import { Repository } from 'typeorm';
import { Level } from './level.entity';
import { AppDataSource } from '../../config/data-source';

export const LevelRepo = AppDataSource.getRepository(Level).extend({
  async findLevelById(id: number): Promise<Level | undefined> {
    return this.findOne({
      where: { id }
    });
  },

  async findLevelsBySetId(setId: number): Promise<Level[]> {
    return this.find({
      where: { setId },
      order: { orderIndex: 'ASC' }
    });
  },

  async getNextOrderIndex(setId: number): Promise<number> {
    const result = await this.createQueryBuilder('level')
      .select('MAX(level.order_index)', 'maxOrderIndex')
      .where('level.set_id = :setId', { setId })
      .getRawOne();
    
    return (result.maxOrderIndex || 0) + 1;
  }
}); 