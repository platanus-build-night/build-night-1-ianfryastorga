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
    console.log("findAllCourses - Consultando cursos. Filtro published:", published);
    
    const query = this.createQueryBuilder('course');
    
    // Solo aplicar filtro cuando published es explícitamente true o false
    if (published === true) {
      console.log("findAllCourses - Filtrando solo cursos publicados");
      query.andWhere('course.is_published = :published', { published: 1 });
    } else if (published === false) {
      console.log("findAllCourses - Filtrando solo cursos no publicados");
      query.andWhere('course.is_published = :published', { published: 0 });
    } else {
      console.log("findAllCourses - Sin filtro de publicación, mostrando todos los cursos");
    }
    
    // Ejecutar consulta SQL directa para asegurar que estamos viendo todos los cursos
    try {
      const rawCourses = await AppDataSource.manager.query("SELECT * FROM courses");
      console.log("findAllCourses - Cursos encontrados con SQL directo:", rawCourses);
    } catch (error) {
      console.error("Error al ejecutar SQL directo:", error);
    }
    
    console.log("findAllCourses - SQL generado:", query.getQuery());
    console.log("findAllCourses - Parámetros:", query.getParameters());
    
    const courses = await query.orderBy('course.created_at', 'DESC').getMany();
    console.log("findAllCourses - Resultado final:", courses);
    
    return courses;
  },

  async findCoursesByUserId(userId: string): Promise<Course[]> {
    return this.find({
      where: { createdById: userId },
      order: { createdAt: 'DESC' }
    });
  }
}); 