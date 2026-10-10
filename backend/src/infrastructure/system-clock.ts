import type { Clock } from '../application/ports/clock.ts';
import { isoDate, type IsoDate } from '../domain/shared/iso-date.ts';

// en-CA formats as YYYY-MM-DD.
const indiaDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' });

export class SystemClock implements Clock {
  today(): IsoDate {
    return isoDate(indiaDate.format(this.now()));
  }

  now(): Date {
    return new Date();
  }
}
