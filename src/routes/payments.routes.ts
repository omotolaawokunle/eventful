import { Router } from 'express';
import { PaymentsService } from '../payments/payments.service';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

export function createPaymentsRouter(paymentsService: PaymentsService): Router {
  const router = Router();

  router.post('/initialize', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const result = await paymentsService.initializePayment(req.body, req.user!.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/verify/:reference', async (req, res, next) => {
    try {
      const result = await paymentsService.verifyPayment(req.params.reference);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post('/webhook', async (req, res, next) => {
    try {
      const result = await paymentsService.handleWebhook(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/event/:eventId', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const payments = await paymentsService.getPaymentHistory(req.params.eventId, req.user!.id);
      res.json(payments);
    } catch (err) {
      next(err);
    }
  });

  router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
    try {
      const payments = await paymentsService.getAllPayments(req.user!.id);
      res.json(payments);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
