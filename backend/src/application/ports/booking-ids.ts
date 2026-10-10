import type { BookingRequestId } from '../../domain/booking/booking-request.ts';

export interface BookingIds {
  nextId(): BookingRequestId;
  /** A short code that is easy to read out over the phone. */
  nextReference(): string;
}
