import type { IsoDate } from '../../domain/shared/iso-date.ts';

export interface Clock {
  /** Today's calendar date where the yatras operate (India). */
  today(): IsoDate;
  now(): Date;
}
