import { AppDataSource } from '../../config/data-source';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export const UserRepo = AppDataSource.getRepository(User).extend({
  findByEmail(email: string) {
    return this.findOneBy({ email });
  },
}) as Repository<User> & {
  findByEmail(email: string): Promise<User | null>;
};
