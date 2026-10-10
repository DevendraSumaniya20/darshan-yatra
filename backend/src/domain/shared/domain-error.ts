export type DomainErrorKind = 'not_found' | 'conflict' | 'invalid';

/**
 * Base for every error raised by domain and application code.
 * `kind` lets outer layers pick a transport status without the domain knowing about HTTP.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly kind: DomainErrorKind;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
