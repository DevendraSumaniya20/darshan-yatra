import type { DepartureProps } from '../../../domain/yatra/departure.ts';
import type { Yatra, YatraId } from '../../../domain/yatra/yatra.ts';
import type { Page, YatraFilter, YatraRepository } from '../../../domain/yatra/yatra-repository.ts';

export class InMemoryYatraRepository implements YatraRepository {
  private readonly yatras: readonly Yatra[];
  private readonly departures: readonly DepartureProps[];

  /** Departures are needed only to answer the `departingBetween` filter. */
  constructor(yatras: readonly Yatra[], departures: readonly DepartureProps[] = []) {
    this.yatras = yatras;
    this.departures = departures;
  }

  async search(filter: YatraFilter, page: Page): Promise<{ items: Yatra[]; total: number }> {
    const matches = this.yatras
      .filter((yatra) => this.matches(yatra, filter))
      .sort((a, b) => a.name.localeCompare(b.name));
    const start = (page.page - 1) * page.pageSize;
    return { items: matches.slice(start, start + page.pageSize), total: matches.length };
  }

  async findBySlug(slug: string): Promise<Yatra | null> {
    return this.yatras.find((yatra) => yatra.slug === slug) ?? null;
  }

  async findById(id: YatraId): Promise<Yatra | null> {
    return this.yatras.find((yatra) => yatra.id === id) ?? null;
  }

  async listStartCities(): Promise<string[]> {
    return [...new Set(this.yatras.map((yatra) => yatra.startCity))].sort();
  }

  private matches(yatra: Yatra, filter: YatraFilter): boolean {
    if (filter.circuit && yatra.circuit !== filter.circuit) return false;
    if (filter.startCity && yatra.startCity.toLowerCase() !== filter.startCity.toLowerCase()) {
      return false;
    }
    if (filter.difficulty && yatra.difficulty !== filter.difficulty) return false;
    if (filter.maxDurationDays && yatra.durationDays > filter.maxDurationDays) return false;
    if (filter.departingBetween) {
      const { from, before } = filter.departingBetween;
      return this.departures.some(
        (departure) =>
          departure.yatraId === yatra.id &&
          departure.startDate >= from &&
          departure.startDate < before,
      );
    }
    return true;
  }
}
