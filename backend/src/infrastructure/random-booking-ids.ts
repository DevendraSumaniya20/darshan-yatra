import { randomInt, randomUUID } from 'node:crypto';
import type { BookingIds } from '../application/ports/booking-ids.ts';
import type { BookingRequestId } from '../domain/booking/booking-request.ts';

// No 0/O, 1/I/L or other pairs that are confused when read aloud.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const REFERENCE_LENGTH = 6;

export class RandomBookingIds implements BookingIds {
  nextId(): BookingRequestId {
    return randomUUID() as BookingRequestId;
  }

  nextReference(): string {
    let code = '';
    for (let i = 0; i < REFERENCE_LENGTH; i += 1) {
      code += ALPHABET[randomInt(ALPHABET.length)];
    }
    return `DY-${code}`;
  }
}
