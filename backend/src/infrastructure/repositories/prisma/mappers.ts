import type {
  Departure as DepartureRow,
  ItineraryDay as ItineraryDayRow,
  Yatra as YatraRow,
} from '../../../../generated/prisma/client.ts';
import { isoDateFromUtc } from '../../../domain/shared/iso-date.ts';
import { paise } from '../../../domain/shared/paise.ts';
import { Departure, type DepartureId } from '../../../domain/yatra/departure.ts';
import { isCircuit, isDifficulty, type Yatra, type YatraId } from '../../../domain/yatra/yatra.ts';

export function toYatra(row: YatraRow & { itinerary: ItineraryDayRow[] }): Yatra {
  if (!isCircuit(row.circuit)) throw new Error(`Yatra ${row.id} has unknown circuit "${row.circuit}"`);
  if (!isDifficulty(row.difficulty)) {
    throw new Error(`Yatra ${row.id} has unknown difficulty "${row.difficulty}"`);
  }

  return {
    id: row.id as YatraId,
    slug: row.slug,
    name: row.name,
    circuit: row.circuit,
    summary: row.summary,
    durationDays: row.durationDays,
    startCity: row.startCity,
    endCity: row.endCity,
    difficulty: row.difficulty,
    maxAltitudeM: row.maxAltitudeM,
    walkingKm: row.walkingKm,
    basePrice: paise(row.basePricePaise),
    seasonStartMonth: row.seasonStartMonth,
    seasonEndMonth: row.seasonEndMonth,
    places: toStringList(row.places),
    inclusions: toStringList(row.inclusions),
    exclusions: toStringList(row.exclusions),
    itinerary: row.itinerary
      .toSorted((a, b) => a.day - b.day)
      .map((day) => ({
        day: day.day,
        title: day.title,
        description: day.description,
        overnight: day.overnight,
      })),
  };
}

export function toDeparture(row: DepartureRow): Departure {
  return new Departure({
    id: row.id as DepartureId,
    yatraId: row.yatraId as YatraId,
    startDate: isoDateFromUtc(row.startDate),
    seatsTotal: row.seatsTotal,
    seatsBooked: row.seatsBooked,
    price: paise(row.pricePaise),
  });
}

function toStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
}
