import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isoDate } from '../shared/iso-date.ts';
import { rupees } from '../shared/paise.ts';
import { Departure, type DepartureId, type DepartureProps } from './departure.ts';
import type { YatraId } from './yatra.ts';

function props(overrides: Partial<DepartureProps> = {}): DepartureProps {
  return {
    id: 'dep-1' as DepartureId,
    yatraId: 'yatra-1' as YatraId,
    startDate: isoDate('2027-05-08'),
    seatsTotal: 24,
    seatsBooked: 0,
    price: rupees(32500),
    ...overrides,
  };
}

describe('Departure', () => {
  it('reports seats left and availability', () => {
    assert.equal(new Departure(props({ seatsBooked: 4 })).availability, 'open');
    assert.equal(new Departure(props({ seatsBooked: 19 })).availability, 'filling');
    assert.equal(new Departure(props({ seatsBooked: 19 })).seatsLeft, 5);
    assert.equal(new Departure(props({ seatsBooked: 24 })).availability, 'sold_out');
  });

  it('refuses more booked seats than it has', () => {
    assert.throws(() => new Departure(props({ seatsBooked: 25 })), RangeError);
    assert.throws(() => new Departure(props({ seatsTotal: 0 })), RangeError);
  });

  it('closes for booking on the day it leaves', () => {
    const departure = new Departure(props());

    assert.equal(departure.isOpenOn(isoDate('2027-05-07')), true);
    assert.equal(departure.isOpenOn(isoDate('2027-05-08')), false);
  });
});
