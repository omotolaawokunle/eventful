import { Router } from 'express';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

export function createAuthRouter(authService: AuthService, usersService: UsersService): Router {
  const router = Router();

  router.post('/register', async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/profile', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const profile = await authService.getProfile(req.user!.id);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
