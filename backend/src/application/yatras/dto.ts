import { addDays } from '../../domain/shared/iso-date.ts';
import type { Availability, Departure } from '../../domain/yatra/departure.ts';
import type { Circuit, Difficulty, ItineraryDay, Yatra, YatraPhoto } from '../../domain/yatra/yatra.ts';

export type DepartureDto = {
  id: string;
  startDate: string;
  endDate: string;
  pricePaise: number;
  seatsTotal: number;
  seatsLeft: number;
  availability: Availability;
};

export type YatraSummaryDto = {
  id: string;
  slug: string;
  name: string;
  circuit: Circuit;
  summary: string;
  durationDays: number;
  startCity: string;
  endCity: string;
  difficulty: Difficulty;
  maxAltitudeM: number | null;
  walkingKm: number;
  places: readonly string[];
  photo: YatraPhoto | null;
  seasonStartMonth: number;
  seasonEndMonth: number;
  /** Lowest price among upcoming departures, or the base price when none are scheduled. */
  fromPricePaise: number;
  nextDeparture: DepartureDto | null;
  upcomingDepartureCount: number;
};

export type YatraDetailDto = YatraSummaryDto & {
  inclusions: readonly string[];
  exclusions: readonly string[];
  itinerary: readonly ItineraryDay[];
  departures: DepartureDto[];
};

export function toDepartureDto(departure: Departure, durationDays: number): DepartureDto {
  return {
    id: departure.id,
    startDate: departure.startDate,
    endDate: addDays(departure.startDate, durationDays - 1),
    pricePaise: departure.price,
    seatsTotal: departure.seatsTotal,
    seatsLeft: departure.seatsLeft,
    availability: departure.availability,
  };
}

/** `upcoming` must already be sorted earliest first. */
export function toYatraSummaryDto(yatra: Yatra, upcoming: readonly Departure[]): YatraSummaryDto {
  const next = upcoming.find((departure) => departure.seatsLeft > 0) ?? upcoming[0] ?? null;
  const fromPrice = upcoming.reduce<number>(
    (lowest, departure) => Math.min(lowest, departure.price),
    upcoming[0]?.price ?? yatra.basePrice,
  );

  return {
    id: yatra.id,
    slug: yatra.slug,
    name: yatra.name,
    circuit: yatra.circuit,
    summary: yatra.summary,
    durationDays: yatra.durationDays,
    startCity: yatra.startCity,
    endCity: yatra.endCity,
    difficulty: yatra.difficulty,
    maxAltitudeM: yatra.maxAltitudeM,
    walkingKm: yatra.walkingKm,
    places: yatra.places,
    photo: yatra.photo,
    seasonStartMonth: yatra.seasonStartMonth,
    seasonEndMonth: yatra.seasonEndMonth,
    fromPricePaise: fromPrice,
    nextDeparture: next ? toDepartureDto(next, yatra.durationDays) : null,
    upcomingDepartureCount: upcoming.length,
  };
}
