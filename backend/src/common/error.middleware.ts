import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  const map: Record<string, number> = {
    EMAIL_TAKEN: 400,
    INVALID_CREDENTIALS: 401,
  };

  const status = map[err.message] ?? 500;
  res.status(status).json({ error: err.message ?? 'INTERNAL_ERROR' });
}
