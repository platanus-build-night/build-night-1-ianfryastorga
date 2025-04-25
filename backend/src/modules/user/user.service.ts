import { CreateUserDTO, LoginDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepo } from './user.repository';

class UserService {
  async create(data: CreateUserDTO): Promise<User> {
    if (await UserRepo.findByEmail(data.email)) {
      throw new Error('EMAIL_TAKEN');
    }
    const user = UserRepo.create(data);
    return UserRepo.save(user);
  }

  async login({ email, password }: LoginDTO): Promise<User> {
    const user = await UserRepo.findOneBy({ email, password });
    if (!user) throw new Error('INVALID_CREDENTIALS');
    return user;
  }

  list() {
    return UserRepo.find();
  }
}

export const userService = new UserService();
