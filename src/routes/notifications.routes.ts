import { Router } from 'express';
import { NotificationsService } from '../notifications/notifications.service';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

export function createNotificationsRouter(notificationsService: NotificationsService): Router {
  const router = Router();

  router.post('/reminders', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const reminder = await notificationsService.createReminder(req.body, req.user!.id);
      res.status(201).json(reminder);
    } catch (err) {
      next(err);
    }
  });

  router.get('/reminders', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const reminders = await notificationsService.findMyReminders(req.user!.id);
      res.json(reminders);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/reminders/:id', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      await notificationsService.deleteReminder(req.params.id, req.user!.id);
      res.json({ message: 'Reminder deleted' });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
