/** The part of a departure the booking form needs. */
export type BookableDeparture = {
  id: string;
  startDate: string;
  endDate: string;
  pricePaise: number;
  seatsLeft: number;
};

/** Larger groups are arranged by phone. Mirrors the server rule. */
export const MAX_TRAVELLERS = 10;

export type BookingDraft = {
  contactName: string;
  phone: string;
  email: string;
  travellers: number;
  note: string;
};

export type BookingField = keyof BookingDraft;
export type BookingErrors = Partial<Record<BookingField, string>>;

export type BookingConfirmation = {
  reference: string;
  status: string;
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

export const EMPTY_DRAFT: BookingDraft = {
  contactName: '',
  phone: '',
  email: '',
  travellers: 1,
  note: '',
};

/** Accepts spaces, dashes, a leading 0, +91 or 91 around a ten-digit mobile number. */
export function isIndianMobile(input: string): boolean {
  const digits = input.replace(/[\s()-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits);
}

export function maxTravellers(departure: BookableDeparture): number {
  return Math.min(MAX_TRAVELLERS, departure.seatsLeft);
}

export function validateBooking(draft: BookingDraft): BookingErrors {
  const errors: BookingErrors = {};

  if (draft.contactName.trim().length < 2) {
    errors.contactName = 'Enter the name of the person we should call.';
  }

  if (draft.phone.trim() === '') {
    errors.phone = 'Enter a mobile number so we can call to confirm.';
  } else if (!isIndianMobile(draft.phone)) {
    errors.phone = 'Enter a 10-digit Indian mobile number, for example 98250 12345.';
  }

  const email = draft.email.trim();
  if (email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a full email address, or leave this empty.';
  }

  if (draft.note.length > 500) {
    errors.note = 'Keep the note under 500 characters.';
  }

  return errors;
}

/** "9825012345" becomes "98250 12345". */
export function formatMobile(tenDigits: string): string {
  // A non-breaking space keeps the number on one line.
  return `${tenDigits.slice(0, 5)}\u00a0${tenDigits.slice(5)}`;
}
