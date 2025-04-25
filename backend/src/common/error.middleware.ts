import { Request, Response, NextFunction } from 'express';
import { 
  NotFoundError, 
  BadRequestError, 
  UnauthorizedError, 
  ForbiddenError 
} from './errors';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  // Mapa de errores básicos
  const basicErrorMap: Record<string, number> = {
    EMAIL_TAKEN: 400,
    INVALID_CREDENTIALS: 401,
  };

  // Determinar el código de estado según el tipo de error
  let status = 500;
  
  if (err instanceof NotFoundError) {
    status = 404;
  } else if (err instanceof BadRequestError) {
    status = 400;
  } else if (err instanceof UnauthorizedError) {
    status = 401;
  } else if (err instanceof ForbiddenError) {
    status = 403;
  } else {
    // Para errores básicos usamos el mapa
    status = basicErrorMap[err.message] ?? 500;
  }

  res.status(status).json({ error: err.message ?? 'INTERNAL_ERROR' });
}
