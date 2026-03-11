import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error & { status?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error]', err.message);

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    status,
  });
};
