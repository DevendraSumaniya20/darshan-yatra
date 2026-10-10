import type { FormEvent } from 'react';
import { formatMonth } from '../../../shared/lib/format';
import { NO_FILTERS, type YatraFilters } from '../api/yatraGateway';
import { upcomingMonths } from '../model/filters';
import './YatraFinder.css';

type YatraFinderProps = {
  cities: readonly string[];
  suggestions: readonly string[];
  onFind: (filters: YatraFilters, query: string) => void;
};

const MONTHS = upcomingMonths(new Date());

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

/** The short way into the catalogue: a place, a leaving city and a month. */
export function YatraFinder({ cities, suggestions, onFind }: YatraFinderProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onFind(
      {
        ...NO_FILTERS,
        startCity: field(data, 'startCity') || null,
        month: field(data, 'month') || null,
      },
      field(data, 'q'),
    );
  }

  return (
    <form className="yatra-finder" role="search" aria-label="Find a yatra" onSubmit={submit}>
      <label className="field">
        <span className="field__label">Place or yatra name</span>
        <input
          className="field__control"
          type="search"
          name="q"
          list="yatra-finder-names"
          placeholder="Kedarnath, Dwarka, Tirupati"
          autoComplete="off"
        />
        <datalist id="yatra-finder-names">
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>

      <label className="field">
        <span className="field__label">Leaving from</span>
        <select className="field__control" name="startCity" defaultValue="">
          <option value="">Any city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Month</span>
        <select className="field__control" name="month" defaultValue="">
          <option value="">Any month</option>
          {MONTHS.map((month) => (
            <option key={month} value={month}>
              {formatMonth(month)}
            </option>
          ))}
        </select>
      </label>

      <button className="button button--large" type="submit">
        Search yatras
      </button>
    </form>
  );
}
