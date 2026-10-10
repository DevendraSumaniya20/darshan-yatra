import type { DepartureRepository } from '../../domain/yatra/departure-repository.ts';
import { YatraNotFoundError } from '../../domain/yatra/errors.ts';
import type { YatraRepository } from '../../domain/yatra/yatra-repository.ts';
import type { Clock } from '../ports/clock.ts';
import { toDepartureDto, toYatraSummaryDto, type YatraDetailDto } from './dto.ts';

export class GetYatraDetail {
  private readonly yatras: YatraRepository;
  private readonly departures: DepartureRepository;
  private readonly clock: Clock;

  constructor(yatras: YatraRepository, departures: DepartureRepository, clock: Clock) {
    this.yatras = yatras;
    this.departures = departures;
    this.clock = clock;
  }

  async execute(slug: string): Promise<YatraDetailDto> {
    const yatra = await this.yatras.findBySlug(slug);
    if (!yatra) throw new YatraNotFoundError(slug);

    const upcoming = await this.departures.findUpcoming([yatra.id], this.clock.today());

    return {
      ...toYatraSummaryDto(yatra, upcoming),
      inclusions: yatra.inclusions,
      exclusions: yatra.exclusions,
      itinerary: yatra.itinerary,
      departures: upcoming.map((departure) => toDepartureDto(departure, yatra.durationDays)),
    };
  }
}
