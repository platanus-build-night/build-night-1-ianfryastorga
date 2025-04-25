import { Course } from './course.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { NotFoundError } from '../../common/errors';
import { CourseRepo } from './course.repository';

export class CourseService {
  async createCourse(createCourseDto: CreateCourseDto, userId: string): Promise<Course> {
    const newCourse = CourseRepo.create({
      ...createCourseDto,
      createdById: userId
    });

    return CourseRepo.save(newCourse);
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