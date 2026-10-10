import { useAsync } from '../../../shared/lib/useAsync';
import { getYatra, listStartCities, listYatras, type YatraFilters } from './yatraGateway';

export function useYatras(filters: YatraFilters) {
  return useAsync(`yatras:${JSON.stringify(filters)}`, (signal) => listYatras(filters, signal));
}

export function useYatra(slug: string) {
  return useAsync(`yatra:${slug}`, (signal) => getYatra(slug, signal));
}

export function useStartCities() {
  return useAsync('start-cities', listStartCities);
}
