import type { BookingRequest } from './booking-request.ts';

export interface BookingRepository {
  /**
   * Stores the request and adds its travellers to the departure's booked seats as one atomic step.
   *
   * Returns false, storing nothing, when the departure's booked count is no longer
   * `expectedSeatsBooked`: someone else booked in between and the caller must re-check availability.
   */
  placeWithSeatHold(booking: BookingRequest, expectedSeatsBooked: number): Promise<boolean>;
}
