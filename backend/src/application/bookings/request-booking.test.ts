import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { BookingRepository } from '../../domain/booking/booking-repository.ts';
import type { BookingRequest, BookingRequestId } from '../../domain/booking/booking-request.ts';
import { InvalidBookingError } from '../../domain/booking/errors.ts';
import type { DepartureProps } from '../../domain/yatra/departure.ts';
import {
  DepartureClosedError,
  DepartureNotFoundError,
  SeatsUnavailableError,
} from '../../domain/yatra/errors.ts';
import { InMemoryBookingRepository } from '../../infrastructure/repositories/in-memory/in-memory-booking-repository.ts';
import { InMemoryDepartureRepository } from '../../infrastructure/repositories/in-memory/in-memory-departure-repository.ts';
import { InMemoryYatraRepository } from '../../infrastructure/repositories/in-memory/in-memory-yatra-repository.ts';
import type { BookingIds } from '../ports/booking-ids.ts';
import { aDeparture, aYatra, FixedClock } from '../testing/fixtures.ts';
import { RequestBooking, type RequestBookingInput } from './request-booking.ts';

class SequentialIds implements BookingIds {
  private count = 0;

  nextId(): BookingRequestId {
    this.count += 1;
    return `booking-${this.count}` as BookingRequestId;
  }

  nextReference(): string {
    return `DY-TEST${this.count}`;
  }
}

const ujjain = aYatra({ slug: 'ujjain', name: 'Mahakaleshwar', durationDays: 3 });

function setup(departure: DepartureProps, wrap?: (repo: BookingRepository) => BookingRepository) {
  const departures = new InMemoryDepartureRepository([departure]);
  const bookings = new InMemoryBookingRepository(departures);
  const requestBooking = new RequestBooking(
    new InMemoryYatraRepository([ujjain]),
    departures,
    wrap ? wrap(bookings) : bookings,
    new SequentialIds(),
    new FixedClock('2026-10-10'),
  );
  return { requestBooking, departures, bookings };
}

function input(departure: DepartureProps, overrides: Partial<RequestBookingInput> = {}): RequestBookingInput {
  return {
    departureId: departure.id,
    contactName: '  Meera   Joshi ',
    phone: '+91 98250 12345',
    email: null,
    travellers: 2,
    note: null,
    ...overrides,
  };
}

describe('RequestBooking', () => {
  it('holds the seats and returns a reference with the trip dates and total', async () => {
    const departure = aDeparture(ujjain, '2026-11-20', { seatsTotal: 20, seatsBooked: 5 });
    const { requestBooking, departures, bookings } = setup(departure);

    const result = await requestBooking.execute(input(departure, { travellers: 3 }));

    assert.equal(result.reference, 'DY-TEST1');
    assert.equal(result.status, 'pending');
    assert.equal(result.startDate, '2026-11-20');
    assert.equal(result.endDate, '2026-11-22');
    assert.equal(result.totalPaise, 3 * 900000);
    assert.equal(result.contactName, 'Meera Joshi');
    assert.equal(result.phone, '9825012345');
    assert.equal((await departures.findById(departure.id))?.seatsLeft, 12);
    assert.equal(bookings.bookings.length, 1);
  });

  it('rejects a booking when seats are exhausted and leaves the count alone', async () => {
    const departure = aDeparture(ujjain, '2026-11-20', { seatsTotal: 20, seatsBooked: 19 });
    const { requestBooking, departures, bookings } = setup(departure);

    await assert.rejects(
      () => requestBooking.execute(input(departure, { travellers: 2 })),
      (error: unknown) =>
        error instanceof SeatsUnavailableError && error.message === 'Only 1 seat is left on this departure.',
    );
    assert.equal((await departures.findById(departure.id))?.seatsBooked, 19);
    assert.equal(bookings.bookings.length, 0);
  });

  it('rejects a departure that leaves today or has already left', async () => {
    const today = aDeparture(ujjain, '2026-10-10');
    await assert.rejects(() => setup(today).requestBooking.execute(input(today)), DepartureClosedError);
  });

  it('rejects an unknown departure', async () => {
    const departure = aDeparture(ujjain, '2026-11-20');
    const { requestBooking } = setup(departure);

    await assert.rejects(
      () => requestBooking.execute(input(departure, { departureId: 'dep-missing' })),
      DepartureNotFoundError,
    );
  });

  it('rejects bad contact details and oversized groups', async () => {
    const departure = aDeparture(ujjain, '2026-11-20');
    const { requestBooking } = setup(departure);

    await assert.rejects(() => requestBooking.execute(input(departure, { phone: '12345' })), InvalidBookingError);
    await assert.rejects(() => requestBooking.execute(input(departure, { contactName: ' ' })), InvalidBookingError);
    await assert.rejects(() => requestBooking.execute(input(departure, { travellers: 11 })), InvalidBookingError);
    await assert.rejects(() => requestBooking.execute(input(departure, { travellers: 0 })), InvalidBookingError);
  });

  it('re-checks availability when another booking lands first', async () => {
    const departure = aDeparture(ujjain, '2026-11-20', { seatsTotal: 20, seatsBooked: 15 });
    let rival: (() => void) | null = null;

    const { requestBooking, departures } = setup(departure, (real) => ({
      async placeWithSeatHold(booking: BookingRequest, expected: number): Promise<boolean> {
        rival?.();
        rival = null;
        return real.placeWithSeatHold(booking, expected);
      },
    }));
    // Someone else takes 3 seats between our read and our write.
    rival = () => {
      const row = departures.rows.get(departure.id);
      if (row) row.seatsBooked += 3;
    };

    const result = await requestBooking.execute(input(departure, { travellers: 2 }));

    assert.equal(result.reference, 'DY-TEST2');
    assert.equal((await departures.findById(departure.id))?.seatsBooked, 20);
  });

  it('never overbooks when a rival takes the last seats', async () => {
    const departure = aDeparture(ujjain, '2026-11-20', { seatsTotal: 20, seatsBooked: 17 });
    let rival: (() => void) | null = null;

    const { requestBooking, departures } = setup(departure, (real) => ({
      async placeWithSeatHold(booking: BookingRequest, expected: number): Promise<boolean> {
        rival?.();
        rival = null;
        return real.placeWithSeatHold(booking, expected);
      },
    }));
    rival = () => {
      const row = departures.rows.get(departure.id);
      if (row) row.seatsBooked += 2;
    };

    await assert.rejects(
      () => requestBooking.execute(input(departure, { travellers: 3 })),
      SeatsUnavailableError,
    );
    assert.equal((await departures.findById(departure.id))?.seatsBooked, 19);
  });
});
