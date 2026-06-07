import { Router } from 'express';
import { UsersService } from '../users/users.service';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

export function createUsersRouter(usersService: UsersService): Router {
  const router = Router();

  router.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const user = await usersService.findById(req.user!.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  router.patch('/me', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const user = await usersService.update(req.user!.id, req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', requireAuth, async (req, res, next) => {
    try {
      const user = await usersService.findById(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
