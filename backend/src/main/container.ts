import type { Clock } from '../application/ports/clock.ts';
import { GetYatraDetail } from '../application/yatras/get-yatra-detail.ts';
import { ListStartCities } from '../application/yatras/list-start-cities.ts';
import { ListYatras } from '../application/yatras/list-yatras.ts';
import type { DepartureRepository } from '../domain/yatra/departure-repository.ts';
import type { YatraRepository } from '../domain/yatra/yatra-repository.ts';
import type { Env } from '../infrastructure/config/env.ts';
import { InMemoryDepartureRepository } from '../infrastructure/repositories/in-memory/in-memory-departure-repository.ts';
import { InMemoryYatraRepository } from '../infrastructure/repositories/in-memory/in-memory-yatra-repository.ts';
import { createPrismaClient } from '../infrastructure/repositories/prisma/prisma-client.ts';
import { PrismaDepartureRepository } from '../infrastructure/repositories/prisma/prisma-departure-repository.ts';
import { PrismaYatraRepository } from '../infrastructure/repositories/prisma/prisma-yatra-repository.ts';
import { seedDepartures, seedYatras } from '../infrastructure/seed/catalogue.ts';
import { SystemClock } from '../infrastructure/system-clock.ts';
import { YatraController } from '../presentation/http/controllers/yatra-controller.ts';

/**
 * Composition root. The only place that constructs repositories and use cases.
 */
export type Container = {
  env: Env;
  controllers: {
    yatras: YatraController;
  };
  shutdown: () => Promise<void>;
};

type Repositories = {
  yatras: YatraRepository;
  departures: DepartureRepository;
  shutdown: () => Promise<void>;
};

export function buildContainer(env: Env): Container {
  const clock: Clock = new SystemClock();
  const repositories = buildRepositories(env);

  const listYatras = new ListYatras(repositories.yatras, repositories.departures, clock);
  const getYatraDetail = new GetYatraDetail(repositories.yatras, repositories.departures, clock);
  const listStartCities = new ListStartCities(repositories.yatras);

  return {
    env,
    controllers: {
      yatras: new YatraController({ listYatras, getYatraDetail, listStartCities }),
    },
    shutdown: repositories.shutdown,
  };
}

function buildRepositories(env: Env): Repositories {
  if (env.dataSource === 'memory' || env.databaseUrl === null) {
    return {
      yatras: new InMemoryYatraRepository(seedYatras, seedDepartures),
      departures: new InMemoryDepartureRepository(seedDepartures),
      shutdown: async () => {},
    };
  }

  const prisma = createPrismaClient(env.databaseUrl);
  return {
    yatras: new PrismaYatraRepository(prisma),
    departures: new PrismaDepartureRepository(prisma),
    shutdown: () => prisma.$disconnect(),
  };
}
