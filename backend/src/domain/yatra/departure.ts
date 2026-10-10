import type { Brand } from '../shared/brand.ts';
import type { IsoDate } from '../shared/iso-date.ts';
import type { Paise } from '../shared/paise.ts';
import { DepartureClosedError, SeatsUnavailableError } from './errors.ts';
import type { YatraId } from './yatra.ts';

export type DepartureId = Brand<string, 'DepartureId'>;

export type Availability = 'open' | 'filling' | 'sold_out';

/** At or below this many seats left, a departure is shown as filling up. */
const FILLING_THRESHOLD = 5;

export type DepartureProps = {
  id: DepartureId;
  yatraId: YatraId;
  startDate: IsoDate;
  seatsTotal: number;
  seatsBooked: number;
  price: Paise;
};

/** One dated run of a yatra, with a fixed number of seats. */
export class Departure {
  readonly id: DepartureId;
  readonly yatraId: YatraId;
  readonly startDate: IsoDate;
  readonly seatsTotal: number;
  readonly seatsBooked: number;
  readonly price: Paise;

  constructor(props: DepartureProps) {
    if (!Number.isInteger(props.seatsTotal) || props.seatsTotal < 1) {
      throw new RangeError('A departure needs at least one seat.');
    }
    if (
      !Number.isInteger(props.seatsBooked) ||
      props.seatsBooked < 0 ||
      props.seatsBooked > props.seatsTotal
    ) {
      throw new RangeError('Booked seats must be between zero and the total.');
    }
    this.id = props.id;
    this.yatraId = props.yatraId;
    this.startDate = props.startDate;
    this.seatsTotal = props.seatsTotal;
    this.seatsBooked = props.seatsBooked;
    this.price = props.price;
  }

  get seatsLeft(): number {
    return this.seatsTotal - this.seatsBooked;
  }

  get availability(): Availability {
    if (this.seatsLeft === 0) return 'sold_out';
    return this.seatsLeft <= FILLING_THRESHOLD ? 'filling' : 'open';
  }

  /** Bookings close the day before the group leaves. */
  isOpenOn(today: IsoDate): boolean {
    return this.startDate > today;
  }

  /** Returns the departure as it will be once `seats` more are held. Never overbooks. */
  hold(seats: number, today: IsoDate): Departure {
    if (!this.isOpenOn(today)) throw new DepartureClosedError();
    if (seats > this.seatsLeft) throw new SeatsUnavailableError(this.seatsLeft);
    return new Departure({
      id: this.id,
      yatraId: this.yatraId,
      startDate: this.startDate,
      seatsTotal: this.seatsTotal,
      seatsBooked: this.seatsBooked + seats,
      price: this.price,
    });
  }
}
