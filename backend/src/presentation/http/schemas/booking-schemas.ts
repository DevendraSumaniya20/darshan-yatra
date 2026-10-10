import { z } from 'zod';
import { MAX_TRAVELLERS_PER_REQUEST } from '../../../domain/booking/booking-request.ts';
import { parseIndianMobile } from '../../../domain/booking/phone.ts';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);

export const requestBookingBody = z.object({
  departureId: z.string().min(1, 'Choose a departure date').max(128),
  contactName: z
    .string()
    .trim()
    .min(2, 'Enter the name of the person we should call')
    .max(120),
  phone: z
    .string()
    .refine((value) => parseIndianMobile(value) !== null, 'Enter a 10-digit Indian mobile number'),
  email: z
    .union([z.literal(''), z.email('Enter a valid email address, or leave it empty')])
    .nullish()
    .transform((value) => value || null),
  travellers: z
    .number({ error: 'Enter the number of travellers' })
    .int()
    .min(1, 'At least one traveller is needed')
    .max(MAX_TRAVELLERS_PER_REQUEST, `For more than ${MAX_TRAVELLERS_PER_REQUEST} travellers, please call us`),
  note: optionalText(500),
});
