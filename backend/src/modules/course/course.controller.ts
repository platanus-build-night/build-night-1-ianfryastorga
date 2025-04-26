import { Request, Response } from 'express';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';

export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  createCourse = async (req: Request, res: Response): Promise<void> => {
    const courseData: CreateCourseDto = req.body;
    const userId = (req as any).user.id;
    
    const course = await this.courseService.createCourse(courseData, userId);
    res.status(201).json(course);
  };

  updateCourse = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const courseData: UpdateCourseDto = req.body;
    
    const course = await this.courseService.updateCourse(id, courseData);
    res.status(200).json(course);
  };

  getCourse = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const course = await this.courseService.getCourseById(id);
    res.status(200).json(course);
  };

  getAllCourses = async (req: Request, res: Response): Promise<void> => {
    // Solo filtrar por published si está explícitamente definido en la query
    // undefined significa "todos los cursos" (no filtra)
    let publishedFilter = undefined;
    
    if (req.query.published === 'true') {
      publishedFilter = true;
    } else if (req.query.published === 'false') {
      publishedFilter = false;
    }
    
    const courses = await this.courseService.getAllCourses(publishedFilter);
    res.status(200).json(courses);
  };

  getUserCourses = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    
    const courses = await this.courseService.getUserCourses(userId);
    res.status(200).json(courses);
  };

  deleteCourse = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.courseService.deleteCourse(id);
    res.status(204).send();
  };
} 