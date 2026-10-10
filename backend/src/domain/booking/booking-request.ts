import type { Brand } from '../shared/brand.ts';
import { paise, type Paise } from '../shared/paise.ts';
import type { Departure, DepartureId } from '../yatra/departure.ts';
import { InvalidBookingError } from './errors.ts';
import { parseIndianMobile, type IndianMobile } from './phone.ts';

export type BookingRequestId = Brand<string, 'BookingRequestId'>;

/** A request waits as `pending` until the team confirms it by phone. */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

/** Larger groups are arranged by phone so rooms and vehicles can be planned. */
export const MAX_TRAVELLERS_PER_REQUEST = 10;

export type BookingRequest = {
  readonly id: BookingRequestId;
  /** Short code the traveller quotes when the team calls. */
  readonly reference: string;
  readonly departureId: DepartureId;
  readonly contactName: string;
  readonly phone: IndianMobile;
  readonly email: string | null;
  readonly travellers: number;
  readonly note: string | null;
  readonly status: BookingStatus;
  readonly total: Paise;
  readonly createdAt: Date;
};

export type NewBookingRequest = {
  id: BookingRequestId;
  reference: string;
  departure: Departure;
  contactName: string;
  phone: string;
  email: string | null;
  travellers: number;
  note: string | null;
  createdAt: Date;
};

export function createBookingRequest(input: NewBookingRequest): BookingRequest {
  const contactName = input.contactName.trim().replace(/\s+/g, ' ');
  if (contactName.length < 2 || contactName.length > 120) {
    throw new InvalidBookingError('Enter the name of the person we should call.');
  }

  const phone = parseIndianMobile(input.phone);
  if (!phone) throw new InvalidBookingError('Enter a 10-digit Indian mobile number.');

  if (
    !Number.isInteger(input.travellers) ||
    input.travellers < 1 ||
    input.travellers > MAX_TRAVELLERS_PER_REQUEST
  ) {
    throw new InvalidBookingError(
      `A request can cover 1 to ${MAX_TRAVELLERS_PER_REQUEST} travellers. Call us for larger groups.`,
    );
  }

  const email = input.email?.trim().toLowerCase() || null;
  const note = input.note?.trim() || null;

  return {
    id: input.id,
    reference: input.reference,
    departureId: input.departure.id,
    contactName,
    phone,
    email,
    travellers: input.travellers,
    note,
    status: 'pending',
    total: paise(input.departure.price * input.travellers),
    createdAt: input.createdAt,
  };
}
