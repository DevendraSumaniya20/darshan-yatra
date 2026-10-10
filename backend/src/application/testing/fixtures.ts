import { isoDate, type IsoDate } from '../../domain/shared/iso-date.ts';
import { rupees } from '../../domain/shared/paise.ts';
import type { DepartureId, DepartureProps } from '../../domain/yatra/departure.ts';
import type { Yatra, YatraId } from '../../domain/yatra/yatra.ts';
import type { Clock } from '../ports/clock.ts';

export class FixedClock implements Clock {
  private readonly date: IsoDate;

  constructor(date: string) {
    this.date = isoDate(date);
  }

  today(): IsoDate {
    return this.date;
  }

  now(): Date {
    return new Date(`${this.date}T06:30:00Z`);
  }
}

export function aYatra(overrides: Partial<Yatra> & { slug: string }): Yatra {
  return {
    id: `yatra-${overrides.slug}` as YatraId,
    name: overrides.slug,
    circuit: 'jyotirlinga',
    summary: 'A short yatra.',
    durationDays: 3,
    startCity: 'Indore',
    endCity: 'Indore',
    difficulty: 'easy',
    maxAltitudeM: null,
    walkingKm: 4,
    basePrice: rupees(9000),
    seasonStartMonth: 1,
    seasonEndMonth: 12,
    places: ['Ujjain'],
    photo: null,
    gallery: [],
    inclusions: ['Hotel'],
    exclusions: ['Lunch'],
    itinerary: [{ day: 1, title: 'Arrive', description: 'Check in.', overnight: 'Ujjain' }],
    ...overrides,
  };
}

export function aDeparture(
  yatra: Yatra,
  date: string,
  overrides: Partial<Pick<DepartureProps, 'seatsTotal' | 'seatsBooked' | 'price'>> = {},
): DepartureProps {
  return {
    id: `dep-${yatra.slug}-${date}` as DepartureId,
    yatraId: yatra.id,
    startDate: isoDate(date),
    seatsTotal: 20,
    seatsBooked: 0,
    price: yatra.basePrice,
    ...overrides,
  };
}
