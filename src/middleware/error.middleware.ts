import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  const message = err.message || 'Internal server error';
  return res.status(500).json({
    statusCode: 500,
    message,
    timestamp: new Date().toISOString(),
  });
}
