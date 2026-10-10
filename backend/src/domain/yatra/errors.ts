import { DomainError } from '../shared/domain-error.ts';

export class YatraNotFoundError extends DomainError {
  readonly code = 'YATRA_NOT_FOUND';
  readonly kind = 'not_found';

  constructor(slug: string) {
    super(`No yatra found for "${slug}".`);
  }
}

export class DepartureNotFoundError extends DomainError {
  readonly code = 'DEPARTURE_NOT_FOUND';
  readonly kind = 'not_found';

  constructor() {
    super('That departure no longer exists. Please pick another date.');
  }
}

export class DepartureClosedError extends DomainError {
  readonly code = 'DEPARTURE_CLOSED';
  readonly kind = 'conflict';

  constructor() {
    super('Booking for this departure has closed. Please pick a later date.');
  }
}

export class SeatsUnavailableError extends DomainError {
  readonly code = 'SEATS_UNAVAILABLE';
  readonly kind = 'conflict';

  constructor(seatsLeft: number) {
    super(
      seatsLeft === 0
        ? 'This departure is now full. Please pick another date.'
        : `Only ${seatsLeft} ${seatsLeft === 1 ? 'seat is' : 'seats are'} left on this departure.`,
    );
  }
}
