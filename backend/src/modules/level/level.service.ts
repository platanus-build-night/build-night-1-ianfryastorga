import { Level } from './level.entity';
import { CreateLevelDto, UpdateLevelDto } from './level.dto';
import { NotFoundError } from '../../common/errors';
import { LevelRepo } from './level.repository';
import { SetRepo } from '../set/set.repository';

export class LevelService {
  async createLevel(createLevelDto: CreateLevelDto): Promise<Level> {
    // Verificar que el set existe
    const set = await SetRepo.findSetById(createLevelDto.set_id);
    if (!set) {
      throw new NotFoundError(`Set with ID ${createLevelDto.set_id} not found`);
    }

    // Obtener el próximo índice de orden si no se proporciona
    if (createLevelDto.order_index === undefined) {
      createLevelDto.order_index = await LevelRepo.getNextOrderIndex(createLevelDto.set_id);
    }

    const newLevel = LevelRepo.create({
      setId: createLevelDto.set_id,
      title: createLevelDto.title,
      description: createLevelDto.description,
      theoryContent: createLevelDto.theory_content,
      orderIndex: createLevelDto.order_index
    });

    return LevelRepo.save(newLevel);
  }

  async updateLevel(id: number, updateLevelDto: UpdateLevelDto): Promise<Level> {
    const level = await LevelRepo.findLevelById(id);
    
    if (!level) {
      throw new NotFoundError(`Level with ID ${id} not found`);
    }

    const updatedLevel = { 
      ...level, 
      title: updateLevelDto.title !== undefined ? updateLevelDto.title : level.title,
      description: updateLevelDto.description !== undefined ? updateLevelDto.description : level.description,
      theoryContent: updateLevelDto.theory_content !== undefined ? updateLevelDto.theory_content : level.theoryContent,
      orderIndex: updateLevelDto.order_index !== undefined ? updateLevelDto.order_index : level.orderIndex
    };
    
    return LevelRepo.save(updatedLevel);
  }

  async getLevelById(id: number): Promise<Level> {
    const level = await LevelRepo.findLevelById(id);
    
    if (!level) {
      throw new NotFoundError(`Level with ID ${id} not found`);
    }
    
    return level;
  }

  async getLevelsBySetId(setId: number): Promise<Level[]> {
    const set = await SetRepo.findSetById(setId);
    
    if (!set) {
      throw new NotFoundError(`Set with ID ${setId} not found`);
    }
    
    return LevelRepo.findLevelsBySetId(setId);
  }

  async deleteLevel(id: number): Promise<void> {
    const level = await LevelRepo.findLevelById(id);
    
    if (!level) {
      throw new NotFoundError(`Level with ID ${id} not found`);
    }
    
    await LevelRepo.remove(level);
  }
} 