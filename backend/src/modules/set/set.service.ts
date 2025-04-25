import { Set } from './set.entity';
import { CreateSetDto, UpdateSetDto } from './set.dto';
import { NotFoundError } from '../../common/errors';
import { SetRepo } from './set.repository';
import { CourseRepo } from '../course/course.repository';

export class SetService {
  async createSet(createSetDto: CreateSetDto): Promise<Set> {
    // Verificar que el curso existe
    const course = await CourseRepo.findCourseById(createSetDto.course_id);
    if (!course) {
      throw new NotFoundError(`Course with ID ${createSetDto.course_id} not found`);
    }

    // Obtener el próximo índice de orden si no se proporciona
    if (createSetDto.order_index === undefined) {
      createSetDto.order_index = await SetRepo.getNextOrderIndex(createSetDto.course_id);
    }

    const newSet = SetRepo.create({
      courseId: createSetDto.course_id,
      title: createSetDto.title,
      description: createSetDto.description,
      orderIndex: createSetDto.order_index
    });

    return SetRepo.save(newSet);
  }

  async updateSet(id: number, updateSetDto: UpdateSetDto): Promise<Set> {
    const set = await SetRepo.findSetById(id);
    
    if (!set) {
      throw new NotFoundError(`Set with ID ${id} not found`);
    }

    const updatedSet = { 
      ...set, 
      title: updateSetDto.title !== undefined ? updateSetDto.title : set.title,
      description: updateSetDto.description !== undefined ? updateSetDto.description : set.description,
      orderIndex: updateSetDto.order_index !== undefined ? updateSetDto.order_index : set.orderIndex
    };
    
    return SetRepo.save(updatedSet);
  }

  async getSetById(id: number): Promise<Set> {
    const set = await SetRepo.findSetById(id);
    
    if (!set) {
      throw new NotFoundError(`Set with ID ${id} not found`);
    }
    
    return set;
  }

  async getSetsByCourseId(courseId: number): Promise<Set[]> {
    const course = await CourseRepo.findCourseById(courseId);
    
    if (!course) {
      throw new NotFoundError(`Course with ID ${courseId} not found`);
    }
    
    return SetRepo.findSetsByCourseId(courseId);
  }

  async deleteSet(id: number): Promise<void> {
    const set = await SetRepo.findSetById(id);
    
    if (!set) {
      throw new NotFoundError(`Set with ID ${id} not found`);
    }
    
    await SetRepo.remove(set);
  }
} 