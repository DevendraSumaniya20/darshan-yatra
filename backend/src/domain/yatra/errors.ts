import { DomainError } from '../shared/domain-error.ts';

export class YatraNotFoundError extends DomainError {
  readonly code = 'YATRA_NOT_FOUND';
  readonly kind = 'not_found';

  constructor(slug: string) {
    super(`No yatra found for "${slug}".`);
  }
}
