import type { Brand } from './brand.ts';

/**
 * A calendar day as `YYYY-MM-DD`, with no time or zone.
 * Departures are calendar days; keeping them as strings avoids off-by-one errors across time zones,
 * and they compare correctly with `<` and `>`.
 */
export type IsoDate = Brand<string, 'IsoDate'>;

const pattern = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): value is IsoDate {
  if (!pattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isoDate(value: string): IsoDate {
  if (!isIsoDate(value)) throw new RangeError(`Not a calendar date: ${value}`);
  return value;
}

export function isoDateFromUtc(date: Date): IsoDate {
  return isoDate(date.toISOString().slice(0, 10));
}

export function toUtcDate(date: IsoDate): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  const result = toUtcDate(date);
  result.setUTCDate(result.getUTCDate() + days);
  return isoDateFromUtc(result);
}
