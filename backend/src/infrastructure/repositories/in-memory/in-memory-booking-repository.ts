import type { BookingRepository } from '../../../domain/booking/booking-repository.ts';
import type { BookingRequest } from '../../../domain/booking/booking-request.ts';
import type { InMemoryDepartureRepository } from './in-memory-departure-repository.ts';

export class InMemoryBookingRepository implements BookingRepository {
  readonly bookings: BookingRequest[] = [];
  private readonly departures: InMemoryDepartureRepository;

  constructor(departures: InMemoryDepartureRepository) {
    this.departures = departures;
  }

  async placeWithSeatHold(booking: BookingRequest, expectedSeatsBooked: number): Promise<boolean> {
    const departure = this.departures.rows.get(booking.departureId);
    if (!departure || departure.seatsBooked !== expectedSeatsBooked) return false;

    departure.seatsBooked += booking.travellers;
    this.bookings.push(booking);
    return true;
  }
}
