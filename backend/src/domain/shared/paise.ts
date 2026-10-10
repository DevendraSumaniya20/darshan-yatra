import type { Brand } from './brand.ts';

/** Money in Indian paise (1 rupee = 100 paise). Always a non-negative integer. */
export type Paise = Brand<number, 'Paise'>;

export function paise(value: number): Paise {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`Not a valid amount in paise: ${value}`);
  }
  return value as Paise;
}

export function rupees(value: number): Paise {
  return paise(Math.round(value * 100));
}
