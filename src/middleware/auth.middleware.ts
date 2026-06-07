import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ statusCode: 401, message: 'Unauthorized', timestamp: new Date().toISOString() });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ statusCode: 401, message: 'Invalid token', timestamp: new Date().toISOString() });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
    } catch {}
  }
  next();
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}
