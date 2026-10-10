import type { BookingRepository } from '../../domain/booking/booking-repository.ts';
import { createBookingRequest, type BookingStatus } from '../../domain/booking/booking-request.ts';
import { addDays } from '../../domain/shared/iso-date.ts';
import type { DepartureId } from '../../domain/yatra/departure.ts';
import type { DepartureRepository } from '../../domain/yatra/departure-repository.ts';
import { DepartureNotFoundError, SeatsUnavailableError } from '../../domain/yatra/errors.ts';
import type { YatraRepository } from '../../domain/yatra/yatra-repository.ts';
import type { BookingIds } from '../ports/booking-ids.ts';
import type { Clock } from '../ports/clock.ts';

export type RequestBookingInput = {
  departureId: string;
  contactName: string;
  phone: string;
  email: string | null;
  travellers: number;
  note: string | null;
};

export type RequestBookingOutput = {
  reference: string;
  status: BookingStatus;
  yatraName: string;
  yatraSlug: string;
  startCity: string;
  startDate: string;
  endDate: string;
  travellers: number;
  totalPaise: number;
  contactName: string;
  phone: string;
};

/** Other travellers can book the same departure at the same moment; re-check this many times. */
const MAX_ATTEMPTS = 3;

export class RequestBooking {
  private readonly yatras: YatraRepository;
  private readonly departures: DepartureRepository;
  private readonly bookings: BookingRepository;
  private readonly ids: BookingIds;
  private readonly clock: Clock;

  constructor(
    yatras: YatraRepository,
    departures: DepartureRepository,
    bookings: BookingRepository,
    ids: BookingIds,
    clock: Clock,
  ) {
    this.yatras = yatras;
    this.departures = departures;
    this.bookings = bookings;
    this.ids = ids;
    this.clock = clock;
  }

  async execute(input: RequestBookingInput): Promise<RequestBookingOutput> {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const departure = await this.departures.findById(input.departureId as DepartureId);
      if (!departure) throw new DepartureNotFoundError();

      const yatra = await this.yatras.findById(departure.yatraId);
      if (!yatra) throw new DepartureNotFoundError();

      const booking = createBookingRequest({
        id: this.ids.nextId(),
        reference: this.ids.nextReference(),
        departure,
        contactName: input.contactName,
        phone: input.phone,
        email: input.email,
        travellers: input.travellers,
        note: input.note,
        createdAt: this.clock.now(),
      });

      // Throws when the departure has closed or lacks the seats.
      departure.hold(booking.travellers, this.clock.today());

      const placed = await this.bookings.placeWithSeatHold(booking, departure.seatsBooked);
      if (!placed) continue;

      return {
        reference: booking.reference,
        status: booking.status,
        yatraName: yatra.name,
        yatraSlug: yatra.slug,
        startCity: yatra.startCity,
        startDate: departure.startDate,
        endDate: addDays(departure.startDate, yatra.durationDays - 1),
        travellers: booking.travellers,
        totalPaise: booking.total,
        contactName: booking.contactName,
        phone: booking.phone,
      };
    }

    // Seats kept changing under us; the honest answer is that we could not secure them.
    const latest = await this.departures.findById(input.departureId as DepartureId);
    throw new SeatsUnavailableError(latest?.seatsLeft ?? 0);
  }
}
