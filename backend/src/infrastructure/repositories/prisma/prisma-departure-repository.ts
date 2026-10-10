import { toUtcDate, type IsoDate } from '../../../domain/shared/iso-date.ts';
import type { Departure, DepartureId } from '../../../domain/yatra/departure.ts';
import type { DepartureRepository } from '../../../domain/yatra/departure-repository.ts';
import type { YatraId } from '../../../domain/yatra/yatra.ts';
import { toDeparture } from './mappers.ts';
import type { PrismaClient } from './prisma-client.ts';

export class PrismaDepartureRepository implements DepartureRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findUpcoming(yatraIds: readonly YatraId[], after: IsoDate): Promise<Departure[]> {
    if (yatraIds.length === 0) return [];
    const rows = await this.prisma.departure.findMany({
      where: { yatraId: { in: [...yatraIds] }, startDate: { gt: toUtcDate(after) } },
      orderBy: { startDate: 'asc' },
    });
    return rows.map(toDeparture);
  }

  async findById(id: DepartureId): Promise<Departure | null> {
    const row = await this.prisma.departure.findUnique({ where: { id } });
    return row ? toDeparture(row) : null;
  }
}
