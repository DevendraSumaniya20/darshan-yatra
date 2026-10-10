import { CIRCUIT_INFO, CIRCUITS, type Circuit, type YatraSummary } from './yatra';

export type CircuitGroup = { circuit: Circuit; yatras: YatraSummary[] };

function searchableText(yatra: YatraSummary): string {
  return [
    yatra.name,
    yatra.startCity,
    yatra.endCity,
    CIRCUIT_INFO[yatra.circuit].name,
    ...yatra.places,
  ]
    .join(' ')
    .toLowerCase();
}

/** Yatras whose name, places, cities or circuit contain every word of the query. */
export function searchYatras(yatras: readonly YatraSummary[], query: string): YatraSummary[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...yatras];

  return yatras.filter((yatra) => {
    const text = searchableText(yatra);
    return words.every((word) => text.includes(word));
  });
}

/** Yatras gathered under their circuit, in catalogue order. Circuits with none are left out. */
export function groupByCircuit(yatras: readonly YatraSummary[]): CircuitGroup[] {
  return CIRCUITS.map((circuit) => ({
    circuit,
    yatras: yatras.filter((yatra) => yatra.circuit === circuit),
  })).filter((group) => group.yatras.length > 0);
}

/** Place and yatra names offered while typing in the search. */
export function searchSuggestions(yatras: readonly YatraSummary[]): string[] {
  const names = yatras.flatMap((yatra) => [yatra.name, ...yatra.places]);
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

/** The cities yatras start from, for choosing where to leave from. */
export function leavingCities(yatras: readonly YatraSummary[]): string[] {
  return [...new Set(yatras.map((yatra) => yatra.startCity))].sort((a, b) => a.localeCompare(b));
}

/** Yatras ordered by their next departure; those with no date fixed come last. */
export function soonestFirst(yatras: readonly YatraSummary[]): YatraSummary[] {
  const NO_DATE = '9999-12-31';
  return [...yatras].sort((a, b) =>
    (a.nextDeparture?.startDate ?? NO_DATE).localeCompare(b.nextDeparture?.startDate ?? NO_DATE),
  );
}
