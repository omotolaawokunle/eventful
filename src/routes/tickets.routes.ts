import { Router } from 'express';
import { TicketsService } from '../tickets/tickets.service';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

export function createTicketsRouter(ticketsService: TicketsService): Router {
  const router = Router();

  router.get('/mine', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const tickets = await ticketsService.findMyTickets(req.user!.id);
      res.json(tickets);
    } catch (err) {
      next(err);
    }
  });

  router.get('/verify/:qrCodeData', async (req, res, next) => {
    try {
      const ticket = await ticketsService.verifyTicket(req.params.qrCodeData);
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  });

  router.post('/scan/:qrCodeData', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const ticket = await ticketsService.scanTicket(req.params.qrCodeData);
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  });

  router.get('/event/:eventId', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const attendees = await ticketsService.getEventAttendees(req.params.eventId, req.user!.id);
      res.json(attendees);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
