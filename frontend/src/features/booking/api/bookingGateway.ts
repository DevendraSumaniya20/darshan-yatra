import { postJson } from '../../../shared/lib/http';
import type { BookingConfirmation, BookingDraft } from '../model/booking';

export async function requestBooking(
  departureId: string,
  draft: BookingDraft,
): Promise<BookingConfirmation> {
  const { data } = await postJson<BookingConfirmation>('/booking-requests', {
    departureId,
    contactName: draft.contactName.trim(),
    phone: draft.phone.trim(),
    email: draft.email.trim(),
    travellers: draft.travellers,
    note: draft.note.trim(),
  });
  return data;
}
