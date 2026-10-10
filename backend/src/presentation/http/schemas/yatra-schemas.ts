import { z } from 'zod';
import { CIRCUITS, DIFFICULTIES } from '../../../domain/yatra/yatra.ts';

export const listYatrasQuery = z.object({
  circuit: z.enum(CIRCUITS).optional(),
  startCity: z.string().trim().min(1).max(64).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  maxDays: z.coerce.number().int().min(1).max(60).optional(),
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use the form YYYY-MM')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(24),
});

export const yatraSlugParams = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]{1,96}$/, 'Not a valid yatra address'),
});
