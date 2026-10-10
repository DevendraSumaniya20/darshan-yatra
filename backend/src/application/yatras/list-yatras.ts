import { addDays, isoDate, type IsoDate } from '../../domain/shared/iso-date.ts';
import type { Departure } from '../../domain/yatra/departure.ts';
import type { DepartureRepository } from '../../domain/yatra/departure-repository.ts';
import type { Circuit, Difficulty, YatraId } from '../../domain/yatra/yatra.ts';
import type { YatraFilter, YatraRepository } from '../../domain/yatra/yatra-repository.ts';
import type { Clock } from '../ports/clock.ts';
import { toYatraSummaryDto, type YatraSummaryDto } from './dto.ts';

export type ListYatrasInput = {
  circuit?: Circuit;
  startCity?: string;
  difficulty?: Difficulty;
  maxDurationDays?: number;
  /** Calendar month as `YYYY-MM`. */
  month?: string;
  page: number;
  pageSize: number;
};

export type ListYatrasOutput = {
  items: YatraSummaryDto[];
  total: number;
  page: number;
  pageSize: number;
};

export class ListYatras {
  private readonly yatras: YatraRepository;
  private readonly departures: DepartureRepository;
  private readonly clock: Clock;

  constructor(yatras: YatraRepository, departures: DepartureRepository, clock: Clock) {
    this.yatras = yatras;
    this.departures = departures;
    this.clock = clock;
  }

  async execute(input: ListYatrasInput): Promise<ListYatrasOutput> {
    const today = this.clock.today();

    const filter: YatraFilter = {};
    if (input.circuit) filter.circuit = input.circuit;
    if (input.startCity) filter.startCity = input.startCity;
    if (input.difficulty) filter.difficulty = input.difficulty;
    if (input.maxDurationDays) filter.maxDurationDays = input.maxDurationDays;
    if (input.month) filter.departingBetween = monthRange(input.month, today);

    const { items, total } = await this.yatras.search(filter, {
      page: input.page,
      pageSize: input.pageSize,
    });

    const upcoming = await this.departures.findUpcoming(
      items.map((yatra) => yatra.id),
      today,
    );
    const byYatra = groupByYatra(upcoming);

    return {
      items: items.map((yatra) => toYatraSummaryDto(yatra, byYatra.get(yatra.id) ?? [])),
      total,
      page: input.page,
      pageSize: input.pageSize,
    };
  }
}

/** The part of the month that can still be booked: from tomorrow at the earliest. */
function monthRange(month: string, today: IsoDate): { from: IsoDate; before: IsoDate } {
  const [year, monthNumber] = month.split('-').map(Number) as [number, number];
  const first = isoDate(`${month}-01`);
  const nextMonth =
    monthNumber === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(monthNumber + 1).padStart(2, '0')}-01`;
  const tomorrow = addDays(today, 1);
  return { from: first > tomorrow ? first : tomorrow, before: isoDate(nextMonth) };
}

function groupByYatra(departures: readonly Departure[]): Map<YatraId, Departure[]> {
  const groups = new Map<YatraId, Departure[]>();
  for (const departure of departures) {
    const group = groups.get(departure.yatraId);
    if (group) group.push(departure);
    else groups.set(departure.yatraId, [departure]);
  }
  return groups;
}
