import type { Brand } from '../shared/brand.ts';

/** An Indian mobile number as ten digits, without country code. */
export type IndianMobile = Brand<string, 'IndianMobile'>;

/** Accepts common ways of writing a number: spaces, dashes, a leading 0, +91 or 91. */
export function parseIndianMobile(input: string): IndianMobile | null {
  const digits = input.replace(/[\s()-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? (digits as IndianMobile) : null;
}
