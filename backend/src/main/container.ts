import { RequestBooking } from '../application/bookings/request-booking.ts';
import type { Clock } from '../application/ports/clock.ts';
import { GetYatraDetail } from '../application/yatras/get-yatra-detail.ts';
import { ListStartCities } from '../application/yatras/list-start-cities.ts';
import { ListYatras } from '../application/yatras/list-yatras.ts';
import type { BookingRepository } from '../domain/booking/booking-repository.ts';
import type { DepartureRepository } from '../domain/yatra/departure-repository.ts';
import type { YatraRepository } from '../domain/yatra/yatra-repository.ts';
import type { Env } from '../infrastructure/config/env.ts';
import { RandomBookingIds } from '../infrastructure/random-booking-ids.ts';
import { InMemoryBookingRepository } from '../infrastructure/repositories/in-memory/in-memory-booking-repository.ts';
import { InMemoryDepartureRepository } from '../infrastructure/repositories/in-memory/in-memory-departure-repository.ts';
import { InMemoryYatraRepository } from '../infrastructure/repositories/in-memory/in-memory-yatra-repository.ts';
import { PrismaBookingRepository } from '../infrastructure/repositories/prisma/prisma-booking-repository.ts';
import { createPrismaClient } from '../infrastructure/repositories/prisma/prisma-client.ts';
import { PrismaDepartureRepository } from '../infrastructure/repositories/prisma/prisma-departure-repository.ts';
import { PrismaYatraRepository } from '../infrastructure/repositories/prisma/prisma-yatra-repository.ts';
import { seedDepartures, seedYatras } from '../infrastructure/seed/catalogue.ts';
import { SystemClock } from '../infrastructure/system-clock.ts';
import { BookingController } from '../presentation/http/controllers/booking-controller.ts';
import { YatraController } from '../presentation/http/controllers/yatra-controller.ts';

/**
 * Composition root. The only place that constructs repositories and use cases.
 */
export type Container = {
  env: Env;
  controllers: {
    yatras: YatraController;
    bookings: BookingController;
  };
  shutdown: () => Promise<void>;
};

type Repositories = {
  yatras: YatraRepository;
  departures: DepartureRepository;
  bookings: BookingRepository;
  shutdown: () => Promise<void>;
};

export function buildContainer(env: Env): Container {
  const clock: Clock = new SystemClock();
  const repositories = buildRepositories(env);

  const listYatras = new ListYatras(repositories.yatras, repositories.departures, clock);
  const getYatraDetail = new GetYatraDetail(repositories.yatras, repositories.departures, clock);
  const listStartCities = new ListStartCities(repositories.yatras);
  const requestBooking = new RequestBooking(
    repositories.yatras,
    repositories.departures,
    repositories.bookings,
    new RandomBookingIds(),
    clock,
  );

  return {
    env,
    controllers: {
      yatras: new YatraController({ listYatras, getYatraDetail, listStartCities }),
      bookings: new BookingController(requestBooking),
    },
    shutdown: repositories.shutdown,
  };
}

function buildRepositories(env: Env): Repositories {
  if (env.dataSource === 'memory' || env.databaseUrl === null) {
    const departures = new InMemoryDepartureRepository(seedDepartures);
    return {
      yatras: new InMemoryYatraRepository(seedYatras, seedDepartures),
      departures,
      bookings: new InMemoryBookingRepository(departures),
      shutdown: async () => {},
    };
  }

  const prisma = createPrismaClient(env.databaseUrl);
  return {
    yatras: new PrismaYatraRepository(prisma),
    departures: new PrismaDepartureRepository(prisma),
    bookings: new PrismaBookingRepository(prisma),
    shutdown: () => prisma.$disconnect(),
  };
}
