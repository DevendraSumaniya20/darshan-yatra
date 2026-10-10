import type { Brand } from '../shared/brand.ts';
import type { Paise } from '../shared/paise.ts';

export type YatraId = Brand<string, 'YatraId'>;

export const CIRCUITS = ['char-dham-himalaya', 'jyotirlinga', 'gujarat-west', 'south-india'] as const;
export type Circuit = (typeof CIRCUITS)[number];

export const DIFFICULTIES = ['easy', 'moderate', 'demanding'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type ItineraryDay = {
  readonly day: number;
  readonly title: string;
  readonly description: string;
  /** Town where the group sleeps; null on the last day. */
  readonly overnight: string | null;
};

/** A pilgrimage tour as it appears in the catalogue. Dated runs of it are `Departure`s. */
export type Yatra = {
  readonly id: YatraId;
  readonly slug: string;
  readonly name: string;
  readonly circuit: Circuit;
  readonly summary: string;
  readonly durationDays: number;
  readonly startCity: string;
  readonly endCity: string;
  readonly difficulty: Difficulty;
  /** Highest point reached, in metres. Null when altitude is not a concern. */
  readonly maxAltitudeM: number | null;
  /** Total distance covered on foot across the yatra, in kilometres. */
  readonly walkingKm: number;
  readonly basePrice: Paise;
  /** Months (1-12) in which the yatra runs. Start may be after end for seasons that cross the new year. */
  readonly seasonStartMonth: number;
  readonly seasonEndMonth: number;
  readonly places: readonly string[];
  readonly inclusions: readonly string[];
  readonly exclusions: readonly string[];
  readonly itinerary: readonly ItineraryDay[];
};

export function isCircuit(value: string): value is Circuit {
  return (CIRCUITS as readonly string[]).includes(value);
}

export function isDifficulty(value: string): value is Difficulty {
  return (DIFFICULTIES as readonly string[]).includes(value);
}
