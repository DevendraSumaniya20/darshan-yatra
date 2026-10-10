import { DomainError } from '../shared/domain-error.ts';

export class InvalidBookingError extends DomainError {
  readonly code = 'INVALID_BOOKING';
  readonly kind = 'invalid';
}
