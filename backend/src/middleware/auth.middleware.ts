import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../common/errors';
import { UserRepo } from '../modules/user/user.repository';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // En una implementación real, se verificaría un token JWT aquí
    // Por ahora, simulamos con un header básico de autenticación
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    // En una implementación real, decodificaríamos y verificaríamos el token
    // Por ahora, simplemente simulamos con un ID de usuario (sería el ID de token decodificado)
    const userId = token;
    
    if (!userId) {
      throw new UnauthorizedError('Invalid token');
    }
    
    const user = await UserRepo.findOneBy({ id: userId });
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    // Añadir el usuario al objeto de solicitud para usarlo en controladores
    (req as any).user = user;
    
    next();
  } catch (error) {
    next(error);
  }
}; 