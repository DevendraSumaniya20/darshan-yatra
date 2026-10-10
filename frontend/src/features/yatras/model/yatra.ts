import { monthName } from '../../../shared/lib/format';

export const CIRCUITS = ['char-dham-himalaya', 'jyotirlinga', 'gujarat-west', 'south-india'] as const;
export type Circuit = (typeof CIRCUITS)[number];

export const DIFFICULTIES = ['easy', 'moderate', 'demanding'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type Availability = 'open' | 'filling' | 'sold_out';

export type Departure = {
  id: string;
  startDate: string;
  endDate: string;
  pricePaise: number;
  seatsTotal: number;
  seatsLeft: number;
  availability: Availability;
};

export type YatraSummary = {
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
  places: string[];
  seasonStartMonth: number;
  seasonEndMonth: number;
  fromPricePaise: number;
  nextDeparture: Departure | null;
  upcomingDepartureCount: number;
};

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  overnight: string | null;
};

export type YatraDetail = YatraSummary & {
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  departures: Departure[];
};

export const CIRCUIT_INFO: Record<Circuit, { name: string; places: string }> = {
  'char-dham-himalaya': {
    name: 'Char Dham and Himalaya',
    places:
      'Yamunotri, Gangotri, Kedarnath, Badrinath and Vaishno Devi. The high shrines are reached on foot and open from May to October.',
  },
  jyotirlinga: {
    name: 'Jyotirlingas',
    places:
      'Kashi Vishwanath, Mahakaleshwar, Omkareshwar, and Bhimashankar, Trimbakeshwar and Grishneshwar in Maharashtra.',
  },
  'gujarat-west': {
    name: 'Gujarat and West',
    places: 'Dwarka, Somnath, Ambaji, Nathdwara and Shirdi, by road from Ahmedabad and Mumbai.',
  },
  'south-india': {
    name: 'South India temples',
    places: 'Tirupati, Madurai, Rameswaram and Kanyakumari.',
  },
};

export const DIFFICULTY_INFO: Record<Difficulty, { label: string; meaning: string }> = {
  easy: { label: 'Easy', meaning: 'Short walks on level ground and temple steps.' },
  moderate: {
    label: 'Moderate',
    meaning: 'One long walk or a long flight of steps. Ponies or palkis can usually be hired.',
  },
  demanding: {
    label: 'Demanding',
    meaning: 'A full day on foot above 3,000 m. Good general fitness is needed.',
  },
};

export function isCircuit(value: string | null): value is Circuit {
  return value !== null && (CIRCUITS as readonly string[]).includes(value);
}

export function isDifficulty(value: string | null): value is Difficulty {
  return value !== null && (DIFFICULTIES as readonly string[]).includes(value);
}

export function seasonLabel(startMonth: number, endMonth: number): string {
  if (startMonth === 1 && endMonth === 12) return 'All year';
  return `${monthName(startMonth)} to ${monthName(endMonth)}`;
}

export function seatsLabel(departure: Pick<Departure, 'seatsLeft'>): string {
  if (departure.seatsLeft === 0) return 'Full';
  return departure.seatsLeft === 1 ? '1 seat left' : `${departure.seatsLeft} seats left`;
}

export function altitudeLabel(metres: number | null): string {
  return metres === null ? 'Below 500 m' : `${metres.toLocaleString('en-IN')} m`;
}

/** The soonest departures that still have seats, one per yatra. */
export function nextDepartures(
  yatras: readonly YatraSummary[],
  limit: number,
): Array<{ yatra: YatraSummary; departure: Departure }> {
  return yatras
    .flatMap((yatra) =>
      yatra.nextDeparture && yatra.nextDeparture.seatsLeft > 0
        ? [{ yatra, departure: yatra.nextDeparture }]
        : [],
    )
    .sort((a, b) => a.departure.startDate.localeCompare(b.departure.startDate))
    .slice(0, limit);
}
