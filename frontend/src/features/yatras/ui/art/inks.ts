/** The print inks available to the picture plates, by token. */
const INK = {
  yellow: 'var(--yellow)',
  pale: 'var(--yellow-pale)',
  blue: 'var(--blue)',
  deep: 'var(--blue-deep)',
  red: 'var(--red)',
  redDeep: 'var(--red-deep)',
  green: 'var(--green)',
  paper: 'var(--paper)',
} as const;

export type Ink = keyof typeof INK;

export function ink(name: Ink): string {
  return INK[name];
}
