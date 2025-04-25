import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

class UserController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.login(req.body);
      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      next(err);
    }
  };

  index = async (_: Request, res: Response) => {
    res.json(await userService.list());
  };
}

export const userController = new UserController();
