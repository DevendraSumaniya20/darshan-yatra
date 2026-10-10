import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rupees } from '../../domain/shared/paise.ts';
import type { DepartureProps } from '../../domain/yatra/departure.ts';
import { YatraNotFoundError } from '../../domain/yatra/errors.ts';
import type { Yatra } from '../../domain/yatra/yatra.ts';
import { InMemoryDepartureRepository } from '../../infrastructure/repositories/in-memory/in-memory-departure-repository.ts';
import { InMemoryYatraRepository } from '../../infrastructure/repositories/in-memory/in-memory-yatra-repository.ts';
import { aDeparture, aYatra, FixedClock } from '../testing/fixtures.ts';
import { GetYatraDetail } from './get-yatra-detail.ts';
import { ListYatras } from './list-yatras.ts';

const kedarnath = aYatra({
  slug: 'kedarnath',
  circuit: 'char-dham-himalaya',
  startCity: 'Haridwar',
  difficulty: 'demanding',
  durationDays: 6,
  basePrice: rupees(21500),
});
const ujjain = aYatra({ slug: 'ujjain', durationDays: 3 });
const tirupati = aYatra({ slug: 'tirupati', circuit: 'south-india', startCity: 'Chennai', durationDays: 2 });

function setup(yatras: Yatra[], departures: DepartureProps[], today = '2026-10-10') {
  const yatraRepo = new InMemoryYatraRepository(yatras, departures);
  const departureRepo = new InMemoryDepartureRepository(departures);
  const clock = new FixedClock(today);
  return {
    listYatras: new ListYatras(yatraRepo, departureRepo, clock),
    getYatraDetail: new GetYatraDetail(yatraRepo, departureRepo, clock),
  };
}

const firstPage = { page: 1, pageSize: 24 };

describe('ListYatras', () => {
  it('filters by circuit, start city, difficulty and length', async () => {
    const { listYatras } = setup([kedarnath, ujjain, tirupati], []);

    const byCircuit = await listYatras.execute({ ...firstPage, circuit: 'south-india' });
    assert.deepEqual(byCircuit.items.map((y) => y.slug), ['tirupati']);

    const byCity = await listYatras.execute({ ...firstPage, startCity: 'haridwar' });
    assert.deepEqual(byCity.items.map((y) => y.slug), ['kedarnath']);

    const byDifficulty = await listYatras.execute({ ...firstPage, difficulty: 'easy' });
    assert.deepEqual(byDifficulty.items.map((y) => y.slug), ['tirupati', 'ujjain']);

    const short = await listYatras.execute({ ...firstPage, maxDurationDays: 3 });
    assert.deepEqual(short.items.map((y) => y.slug), ['tirupati', 'ujjain']);
  });

  it('keeps only yatras that leave in the requested month', async () => {
    const { listYatras } = setup(
      [kedarnath, ujjain],
      [aDeparture(kedarnath, '2027-05-15'), aDeparture(ujjain, '2026-11-20'), aDeparture(ujjain, '2026-12-01')],
    );

    const november = await listYatras.execute({ ...firstPage, month: '2026-11' });
    assert.deepEqual(november.items.map((y) => y.slug), ['ujjain']);

    const december = await listYatras.execute({ ...firstPage, month: '2026-12' });
    assert.deepEqual(december.items.map((y) => y.slug), ['ujjain']);

    const january = await listYatras.execute({ ...firstPage, month: '2027-01' });
    assert.equal(january.total, 0);
  });

  it('does not count departures that have already left when filtering by month', async () => {
    const { listYatras } = setup([ujjain], [aDeparture(ujjain, '2026-10-05')]);

    const october = await listYatras.execute({ ...firstPage, month: '2026-10' });

    assert.equal(october.total, 0);
  });

  it('shows the lowest upcoming price and the next departure with seats', async () => {
    const { listYatras } = setup(
      [kedarnath],
      [
        aDeparture(kedarnath, '2026-09-01'),
        aDeparture(kedarnath, '2027-05-15', { seatsTotal: 20, seatsBooked: 20 }),
        aDeparture(kedarnath, '2027-05-29', { seatsTotal: 20, seatsBooked: 17 }),
        aDeparture(kedarnath, '2027-10-02', { price: rupees(19500) }),
      ],
    );

    const [summary] = (await listYatras.execute(firstPage)).items;

    assert.ok(summary);
    assert.equal(summary.upcomingDepartureCount, 3);
    assert.equal(summary.fromPricePaise, 1950000);
    assert.equal(summary.nextDeparture?.startDate, '2027-05-29');
    assert.equal(summary.nextDeparture?.endDate, '2027-06-03');
    assert.equal(summary.nextDeparture?.seatsLeft, 3);
    assert.equal(summary.nextDeparture?.availability, 'filling');
  });

  it('falls back to the base price when nothing is scheduled', async () => {
    const { listYatras } = setup([ujjain], []);

    const [summary] = (await listYatras.execute(firstPage)).items;

    assert.equal(summary?.fromPricePaise, 900000);
    assert.equal(summary?.nextDeparture, null);
  });

  it('paginates and reports the full total', async () => {
    const { listYatras } = setup([kedarnath, ujjain, tirupati], []);

    const second = await listYatras.execute({ page: 2, pageSize: 2 });

    assert.equal(second.total, 3);
    assert.deepEqual(second.items.map((y) => y.slug), ['ujjain']);
  });
});

describe('GetYatraDetail', () => {
  it('returns the itinerary and upcoming departures, earliest first', async () => {
    const { getYatraDetail } = setup(
      [ujjain],
      [aDeparture(ujjain, '2026-12-25'), aDeparture(ujjain, '2026-11-20'), aDeparture(ujjain, '2026-10-10')],
    );

    const detail = await getYatraDetail.execute('ujjain');

    assert.equal(detail.itinerary.length, 1);
    assert.deepEqual(detail.departures.map((d) => d.startDate), ['2026-11-20', '2026-12-25']);
  });

  it('rejects an unknown slug', async () => {
    const { getYatraDetail } = setup([ujjain], []);

    await assert.rejects(() => getYatraDetail.execute('nowhere'), YatraNotFoundError);
  });
});
