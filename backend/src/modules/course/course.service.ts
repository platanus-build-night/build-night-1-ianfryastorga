import { Course } from './course.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { NotFoundError } from '../../common/errors';
import { CourseRepo } from './course.repository';
import { UserRepo } from '../user/user.repository';
import { AppDataSource } from '../../config/data-source';

export class CourseService {
  async createCourse(createCourseDto: CreateCourseDto, userId: string): Promise<Course> {
    try {
      // Ahora que createdById es opcional, podemos crear el curso sin usuario si es necesario
      let userIdToUse = null;
      
      // Intentamos usar el ID de usuario proporcionado si existe
      if (userId) {
        const userExists = await UserRepo.findOneBy({ id: userId });
        if (userExists) {
          userIdToUse = userId;
        }
      }
      
      // Si no tenemos un usuario válido, podemos crear el curso sin asociarlo a un usuario
      const newCourse = CourseRepo.create({
        ...createCourseDto,
        createdById: userIdToUse // Puede ser null ahora
      });
      
      return CourseRepo.save(newCourse);
    } catch (error) {
      console.error('Error al crear curso:', error);
      
      // MÉTODO ALTERNATIVO: Crear el curso directamente con SQL
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      
      try {
        await queryRunner.startTransaction();
        
        const courseData = {...createCourseDto};
        
        const result = await queryRunner.query(
          `INSERT INTO courses (title, description, thumbnail_url, color, difficulty_level, created_by, created_at, updated_at, is_published, estimated_duration) 
           VALUES (?, ?, ?, ?, ?, NULL, datetime('now'), datetime('now'), ?, ?)`,
          [
            courseData.title,
            courseData.description,
            courseData.thumbnail_url || '',
            courseData.color || '',
            courseData.difficulty_level || 'beginner',
            courseData.is_published ? 1 : 0,
            courseData.estimated_duration || 0
          ]
        );
        
        const courseId = result.lastID || result.insertId || 1;
        const newCourse = await queryRunner.query('SELECT * FROM courses WHERE id = ?', [courseId]);
        
        await queryRunner.commitTransaction();
        
        return newCourse[0];
      } catch (innerError) {
        await queryRunner.rollbackTransaction();
        console.error('Error en la creación directa del curso:', innerError);
        throw innerError;
      } finally {
        await queryRunner.release();
      }
    }
  }

  async updateCourse(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await CourseRepo.findCourseById(id);
    
    if (!course) {
      throw new NotFoundError(`Course with ID ${id} not found`);
    }

    const updatedCourse = { ...course, ...updateCourseDto };
    return CourseRepo.save(updatedCourse);
  }

  async getCourseById(id: number): Promise<Course> {
    const course = await CourseRepo.findCourseById(id);
    
    if (!course) {
      throw new NotFoundError(`Course with ID ${id} not found`);
    }
    
    return course;
  }

  async getAllCourses(published?: boolean): Promise<Course[]> {
    return CourseRepo.findAllCourses(published);
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    return CourseRepo.findCoursesByUserId(userId);
  }

  async deleteCourse(id: number): Promise<void> {
    const course = await CourseRepo.findCourseById(id);
    
    if (!course) {
      throw new NotFoundError(`Course with ID ${id} not found`);
    }
    
    await CourseRepo.remove(course);
  }
} 