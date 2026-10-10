import { Router } from 'express';
import type { BookingController } from '../controllers/booking-controller.ts';

export function bookingRouter(controller: BookingController): Router {
  const router = Router();
  router.post('/booking-requests', controller.create);
  return router;
}
