import type { FormEvent } from 'react';
import './YatraSearch.css';

type YatraSearchProps = {
  query: string;
  suggestions: readonly string[];
  onSearch: (query: string) => void;
};

export function YatraSearch({ query, suggestions, onSearch }: YatraSearchProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const typed = new FormData(event.currentTarget).get('q');
    onSearch(typeof typed === 'string' ? typed.trim() : '');
  }

  return (
    <form className="yatra-search" role="search" onSubmit={submit}>
      <label className="yatra-search__label" htmlFor="yatra-search-input">
        Search by place or yatra name
      </label>
      <div className="yatra-search__row">
        {/* The key refills the box when the search is changed or cleared from elsewhere. */}
        <input
          key={query}
          id="yatra-search-input"
          className="field__control yatra-search__input"
          type="search"
          name="q"
          defaultValue={query}
          list="yatra-search-names"
          placeholder="Kedarnath, Dwarka, Tirupati"
          autoComplete="off"
        />
        <datalist id="yatra-search-names">
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <button className="button button--large" type="submit">
          Search yatras
        </button>
      </div>
    </form>
  );
}
