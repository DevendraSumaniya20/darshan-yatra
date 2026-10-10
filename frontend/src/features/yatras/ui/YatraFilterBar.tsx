import type { ChangeEvent } from 'react';
import { formatMonth } from '../../../shared/lib/format';
import type { YatraFilters } from '../api/yatraGateway';
import { hasFilters, LENGTH_OPTIONS, upcomingMonths } from '../model/filters';
import { DIFFICULTIES, DIFFICULTY_INFO } from '../model/yatra';
import './YatraFilterBar.css';

type YatraFilterBarProps = {
  filters: YatraFilters;
  startCities: readonly string[];
  onChange: (filters: YatraFilters) => void;
  onClear: () => void;
};

const MONTHS = upcomingMonths(new Date());

export function YatraFilterBar({ filters, startCities, onChange, onClear }: YatraFilterBarProps) {
  function set<K extends keyof YatraFilters>(key: K) {
    return (event: ChangeEvent<HTMLSelectElement>) => {
      const raw = event.target.value;
      const value = raw === '' ? null : key === 'maxDays' ? Number(raw) : raw;
      onChange({ ...filters, [key]: value });
    };
  }

  return (
    <form
      className="filter-bar"
      aria-label="Filter yatras"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="field">
        <span className="field__label">Leaving from</span>
        <select
          className="field__control"
          value={filters.startCity ?? ''}
          onChange={set('startCity')}
        >
          <option value="">Any city</option>
          {startCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Month</span>
        <select className="field__control" value={filters.month ?? ''} onChange={set('month')}>
          <option value="">Any month</option>
          {MONTHS.map((month) => (
            <option key={month} value={month}>
              {formatMonth(month)}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Effort</span>
        <select
          className="field__control"
          value={filters.difficulty ?? ''}
          onChange={set('difficulty')}
        >
          <option value="">Any</option>
          {DIFFICULTIES.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {DIFFICULTY_INFO[difficulty].label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Length</span>
        <select className="field__control" value={filters.maxDays ?? ''} onChange={set('maxDays')}>
          <option value="">Any length</option>
          {LENGTH_OPTIONS.map((option) => (
            <option key={option.maxDays} value={option.maxDays}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {hasFilters(filters) && (
        <button className="button button--plain filter-bar__clear" type="button" onClick={onClear}>
          Clear filters
        </button>
      )}
    </form>
  );
}
