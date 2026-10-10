import type { IsoDate } from '../../../domain/shared/iso-date.ts';
import { Departure, type DepartureId, type DepartureProps } from '../../../domain/yatra/departure.ts';
import type { DepartureRepository } from '../../../domain/yatra/departure-repository.ts';
import type { YatraId } from '../../../domain/yatra/yatra.ts';

export class InMemoryDepartureRepository implements DepartureRepository {
  /** Shared with the booking repository so that seat holds are visible here. */
  readonly rows: Map<DepartureId, DepartureProps>;

  constructor(departures: readonly DepartureProps[]) {
    this.rows = new Map(departures.map((departure) => [departure.id, { ...departure }]));
  }

  async findUpcoming(yatraIds: readonly YatraId[], after: IsoDate): Promise<Departure[]> {
    return [...this.rows.values()]
      .filter((row) => yatraIds.includes(row.yatraId) && row.startDate > after)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((row) => new Departure(row));
  }

  async findById(id: DepartureId): Promise<Departure | null> {
    const row = this.rows.get(id);
    return row ? new Departure(row) : null;
  }
}
