import { Request, Response, NextFunction } from 'express';

export function transformResponse(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    if (body && typeof body === 'object' && 'statusCode' in body) {
      return originalJson(body);
    }
    return originalJson({
      statusCode: res.statusCode,
      data: body,
      timestamp: new Date().toISOString(),
    });
  };
  next();
}
