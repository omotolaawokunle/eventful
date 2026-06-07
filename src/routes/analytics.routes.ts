import { Router } from 'express';
import { AnalyticsService } from '../analytics/analytics.service';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

export function createAnalyticsRouter(analyticsService: AnalyticsService): Router {
  const router = Router();

  router.get('/overview', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const analytics = await analyticsService.getCreatorAnalytics(req.user!.id);
      res.json(analytics);
    } catch (err) {
      next(err);
    }
  });

  router.get('/sales', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const analytics = await analyticsService.getSalesAnalytics(req.user!.id);
      res.json(analytics);
    } catch (err) {
      next(err);
    }
  });

  router.get('/event/:eventId', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const analytics = await analyticsService.getEventAnalytics(req.params.eventId, req.user!.id);
      res.json(analytics);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
