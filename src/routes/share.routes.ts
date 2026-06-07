import { Router } from 'express';
import { EventsService } from '../events/events.service';
import { ShareService } from '../share/share.service';
import { optionalAuth } from '../middleware/auth.middleware';

export function createShareRouter(eventsService: EventsService, shareService: ShareService): Router {
  const router = Router();

  router.get('/:eventId', optionalAuth, async (req, res, next) => {
    try {
      const event: any = await eventsService.findOne(req.params.eventId);
      const links = shareService.generateShareLinks(event.id, event.title, event.description);
      res.json(links);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
