import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { AppDataSource } from '../../config/data-source';

export const CourseRepo = AppDataSource.getRepository(Course).extend({
  async findCourseById(id: number): Promise<Course | undefined> {
    return this.findOne({
      where: { id }
    });
  },

  async findAllCourses(published?: boolean): Promise<Course[]> {
    const query = this.createQueryBuilder('course');
    
    if (published !== undefined) {
      query.andWhere('course.is_published = :published', { published });
    }
    
    return query.orderBy('course.created_at', 'DESC').getMany();
  },

  async findCoursesByUserId(userId: string): Promise<Course[]> {
    return this.find({
      where: { createdById: userId },
      order: { createdAt: 'DESC' }
    });
  }
}); 