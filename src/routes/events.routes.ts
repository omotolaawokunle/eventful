import { Router } from 'express';
import { EventsService } from '../events/events.service';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export function createEventsRouter(eventsService: EventsService): Router {
  const router = Router();

  router.post('/', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      if (req.user!.role !== 'CREATOR') throw new AppError(403, 'Only creators can create events');
      const event = await eventsService.create(req.body, req.user!.id);
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  });

  router.get('/', optionalAuth, async (req, res, next) => {
    try {
      const result = await eventsService.findAll(req.query as any);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/mine', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const events = await eventsService.findMyEvents(req.user!.id);
      res.json(events);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', optionalAuth, async (req, res, next) => {
    try {
      const event = await eventsService.findOne(req.params.id);
      res.json(event);
    } catch (err) {
      next(err);
    }
  });

  router.patch('/:id', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const event = await eventsService.update(req.params.id, req.body, req.user!.id);
      res.json(event);
    } catch (err) {
      next(err);
    }
  });

  router.patch('/:id/publish', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const event = await eventsService.publish(req.params.id, req.user!.id);
      res.json(event);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
