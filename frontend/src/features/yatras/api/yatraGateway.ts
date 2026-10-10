import { request } from '../../../shared/lib/http';
import type { Circuit, Difficulty, YatraDetail, YatraSummary } from '../model/yatra';

export type YatraFilters = {
  circuit: Circuit | null;
  startCity: string | null;
  difficulty: Difficulty | null;
  maxDays: number | null;
  /** `YYYY-MM` */
  month: string | null;
};

export const NO_FILTERS: YatraFilters = {
  circuit: null,
  startCity: null,
  difficulty: null,
  maxDays: null,
  month: null,
};

type ListMeta = { total: number; page: number; pageSize: number };

export async function listYatras(
  filters: YatraFilters,
  signal: AbortSignal,
): Promise<{ items: YatraSummary[]; total: number }> {
  const params = new URLSearchParams({ pageSize: '50' });
  if (filters.circuit) params.set('circuit', filters.circuit);
  if (filters.startCity) params.set('startCity', filters.startCity);
  if (filters.difficulty) params.set('difficulty', filters.difficulty);
  if (filters.maxDays) params.set('maxDays', String(filters.maxDays));
  if (filters.month) params.set('month', filters.month);

  const { data, meta } = await request<YatraSummary[], ListMeta>(`/yatras?${params}`, { signal });
  return { items: data, total: meta.total };
}

export async function getYatra(slug: string, signal: AbortSignal): Promise<YatraDetail> {
  const { data } = await request<YatraDetail>(`/yatras/${encodeURIComponent(slug)}`, { signal });
  return data;
}

export async function listStartCities(signal: AbortSignal): Promise<string[]> {
  const { data } = await request<string[]>('/start-cities', { signal });
  return data;
}
