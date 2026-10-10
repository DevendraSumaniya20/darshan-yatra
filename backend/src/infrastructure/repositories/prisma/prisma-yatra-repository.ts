import type { Prisma } from '../../../../generated/prisma/client.ts';
import { toUtcDate } from '../../../domain/shared/iso-date.ts';
import type { Yatra, YatraId } from '../../../domain/yatra/yatra.ts';
import type { Page, YatraFilter, YatraRepository } from '../../../domain/yatra/yatra-repository.ts';
import { toYatra } from './mappers.ts';
import type { PrismaClient } from './prisma-client.ts';

export class PrismaYatraRepository implements YatraRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async search(filter: YatraFilter, page: Page): Promise<{ items: Yatra[]; total: number }> {
    const where: Prisma.YatraWhereInput = {};
    if (filter.circuit) where.circuit = filter.circuit;
    if (filter.startCity) where.startCity = filter.startCity;
    if (filter.difficulty) where.difficulty = filter.difficulty;
    if (filter.maxDurationDays) where.durationDays = { lte: filter.maxDurationDays };
    if (filter.departingBetween) {
      where.departures = {
        some: {
          startDate: {
            gte: toUtcDate(filter.departingBetween.from),
            lt: toUtcDate(filter.departingBetween.before),
          },
        },
      };
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.yatra.findMany({
        where,
        include: { itinerary: true },
        orderBy: { name: 'asc' },
        skip: (page.page - 1) * page.pageSize,
        take: page.pageSize,
      }),
      this.prisma.yatra.count({ where }),
    ]);

    return { items: rows.map(toYatra), total };
  }

  async findBySlug(slug: string): Promise<Yatra | null> {
    const row = await this.prisma.yatra.findUnique({ where: { slug }, include: { itinerary: true } });
    return row ? toYatra(row) : null;
  }

  async findById(id: YatraId): Promise<Yatra | null> {
    const row = await this.prisma.yatra.findUnique({ where: { id }, include: { itinerary: true } });
    return row ? toYatra(row) : null;
  }

  async listStartCities(): Promise<string[]> {
    const rows = await this.prisma.yatra.findMany({
      distinct: ['startCity'],
      select: { startCity: true },
      orderBy: { startCity: 'asc' },
    });
    return rows.map((row) => row.startCity);
  }
}
