import type { IsoDate } from '../shared/iso-date.ts';
import type { Circuit, Difficulty, Yatra, YatraId } from './yatra.ts';

export type YatraFilter = {
  circuit?: Circuit;
  startCity?: string;
  difficulty?: Difficulty;
  maxDurationDays?: number;
  /** Only yatras with a departure starting within this range (inclusive start, exclusive end). */
  departingBetween?: { from: IsoDate; before: IsoDate };
};

export type Page = { page: number; pageSize: number };

export interface YatraRepository {
  search(filter: YatraFilter, page: Page): Promise<{ items: Yatra[]; total: number }>;
  findBySlug(slug: string): Promise<Yatra | null>;
  findById(id: YatraId): Promise<Yatra | null>;
  listStartCities(): Promise<string[]>;
}
