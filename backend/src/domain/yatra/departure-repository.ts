import type { IsoDate } from '../shared/iso-date.ts';
import type { Departure, DepartureId } from './departure.ts';
import type { YatraId } from './yatra.ts';

export interface DepartureRepository {
  /** Departures starting after `after`, earliest first. */
  findUpcoming(yatraIds: readonly YatraId[], after: IsoDate): Promise<Departure[]>;
  findById(id: DepartureId): Promise<Departure | null>;
}
