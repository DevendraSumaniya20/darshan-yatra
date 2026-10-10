import type { RequestHandler } from 'express';
import type { RequestBooking } from '../../../application/bookings/request-booking.ts';
import { requestBookingBody } from '../schemas/booking-schemas.ts';

export class BookingController {
  private readonly requestBooking: RequestBooking;

  constructor(requestBooking: RequestBooking) {
    this.requestBooking = requestBooking;
  }

  create: RequestHandler = async (req, res) => {
    const body = requestBookingBody.parse(req.body);
    const result = await this.requestBooking.execute(body);
    res.status(201).json({ data: result });
  };
}
