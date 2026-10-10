import { toUtcDate } from '../src/domain/shared/iso-date.ts';
import { loadEnv } from '../src/infrastructure/config/env.ts';
import { createPrismaClient } from '../src/infrastructure/repositories/prisma/prisma-client.ts';
import { seedDepartures, seedYatras } from '../src/infrastructure/seed/catalogue.ts';

/**
 * Loads the sample catalogue. Safe to run again: yatras and itineraries are replaced,
 * while existing departures keep their booked seats.
 */
async function main(): Promise<void> {
  const env = loadEnv();
  if (env.databaseUrl === null) throw new Error('DATABASE_URL is required to seed.');
  const prisma = createPrismaClient(env.databaseUrl);

  try {
    for (const yatra of seedYatras) {
      const fields = {
        slug: yatra.slug,
        name: yatra.name,
        circuit: yatra.circuit,
        summary: yatra.summary,
        durationDays: yatra.durationDays,
        startCity: yatra.startCity,
        endCity: yatra.endCity,
        difficulty: yatra.difficulty,
        maxAltitudeM: yatra.maxAltitudeM,
        walkingKm: yatra.walkingKm,
        basePricePaise: yatra.basePrice,
        seasonStartMonth: yatra.seasonStartMonth,
        seasonEndMonth: yatra.seasonEndMonth,
        places: [...yatra.places],
        inclusions: [...yatra.inclusions],
        exclusions: [...yatra.exclusions],
        photoPath: yatra.photo?.path ?? null,
        photoAlt: yatra.photo?.alt ?? null,
        photoCredit: yatra.photo?.credit ?? null,
        photoSourceUrl: yatra.photo?.sourceUrl ?? null,
      };

      await prisma.$transaction([
        prisma.yatra.upsert({
          where: { id: yatra.id },
          create: { id: yatra.id, ...fields },
          update: fields,
        }),
        prisma.itineraryDay.deleteMany({ where: { yatraId: yatra.id } }),
        prisma.itineraryDay.createMany({
          data: yatra.itinerary.map((day) => ({ yatraId: yatra.id, ...day })),
        }),
      ]);
    }

    for (const departure of seedDepartures) {
      const fields = {
        yatraId: departure.yatraId,
        startDate: toUtcDate(departure.startDate),
        seatsTotal: departure.seatsTotal,
        pricePaise: departure.price,
      };
      await prisma.departure.upsert({
        where: { id: departure.id },
        create: { id: departure.id, seatsBooked: departure.seatsBooked, ...fields },
        update: fields,
      });
    }

    console.log(`Seeded ${seedYatras.length} yatras and ${seedDepartures.length} departures.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
