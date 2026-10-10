import type { YatraFilters } from '../api/yatraGateway';
import { isCircuit, isDifficulty } from './yatra';

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Filters live in the address bar so a filtered list can be shared or bookmarked. */
export function filtersFromSearch(search: string): YatraFilters {
  const params = new URLSearchParams(search);
  const circuit = params.get('circuit');
  const difficulty = params.get('difficulty');
  const month = params.get('month');
  const maxDays = Number(params.get('maxDays'));

  return {
    circuit: isCircuit(circuit) ? circuit : null,
    startCity: params.get('startCity')?.trim() || null,
    difficulty: isDifficulty(difficulty) ? difficulty : null,
    maxDays: Number.isInteger(maxDays) && maxDays > 0 ? maxDays : null,
    month: month !== null && MONTH_PATTERN.test(month) ? month : null,
  };
}

export function filtersToSearch(filters: YatraFilters): string {
  const params = new URLSearchParams();
  if (filters.circuit) params.set('circuit', filters.circuit);
  if (filters.startCity) params.set('startCity', filters.startCity);
  if (filters.month) params.set('month', filters.month);
  if (filters.difficulty) params.set('difficulty', filters.difficulty);
  if (filters.maxDays) params.set('maxDays', String(filters.maxDays));
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function hasFilters(filters: YatraFilters): boolean {
  return Object.values(filters).some((value) => value !== null);
}

/** The next twelve months as `YYYY-MM`, starting with the current one. */
export function upcomingMonths(today: Date): string[] {
  return Array.from({ length: 12 }, (_, offset) => {
    const date = new Date(Date.UTC(today.getFullYear(), today.getMonth() + offset, 1));
    return date.toISOString().slice(0, 7);
  });
}

export const LENGTH_OPTIONS = [
  { maxDays: 3, label: 'Up to 3 days' },
  { maxDays: 5, label: 'Up to 5 days' },
  { maxDays: 7, label: 'Up to a week' },
] as const;
