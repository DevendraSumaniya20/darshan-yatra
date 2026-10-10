import { useRef, useState } from 'react';
import { plural } from '../../../shared/lib/format';
import { Link } from '../../../shared/ui/Link';
import { NO_FILTERS } from '../api/yatraGateway';
import { leavingCities, soonestFirst } from '../model/catalogue';
import { filtersToSearch } from '../model/filters';
import type { YatraSummary } from '../model/yatra';
import { PhotoCredits } from './PhotoCredits';
import { useCardEntrance } from './useCardEntrance';
import { YatraCard } from './YatraCard';
import './YatrasByCity.css';

type YatrasByCityProps = {
  yatras: readonly YatraSummary[];
};

/** Two rows of cards at the widest layout; the catalogue page holds the rest. */
const CARD_LIMIT = 6;

/** Yatra cards narrowed by the city they leave from, soonest departure first. */
export function YatrasByCity({ yatras }: YatrasByCityProps) {
  const [city, setCity] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const leaving = soonestFirst(
    city === null ? yatras : yatras.filter((yatra) => yatra.startCity === city),
  );
  const shown = leaving.slice(0, CARD_LIMIT);
  useCardEntrance(root, shown.map((yatra) => yatra.id).join(','));

  const choices: Array<{ value: string | null; label: string }> = [
    { value: null, label: 'Any city' },
    ...leavingCities(yatras).map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="by-city" ref={root}>
      <ul className="by-city__cities" aria-label="Leaving city">
        {choices.map(({ value, label }) => (
          <li key={label}>
            <button
              className="by-city__city"
              type="button"
              aria-pressed={city === value}
              onClick={() => setCity(value)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <p className="by-city__count" role="status">
        {city === null
          ? `Showing the ${shown.length} that leave soonest, of ${plural(leaving.length, 'yatra', 'yatras')}`
          : `${plural(leaving.length, 'yatra leaves', 'yatras leave')} from ${city}`}
      </p>

      <ul className="by-city__cards">
        {shown.map((yatra) => (
          <li key={yatra.id}>
            <YatraCard yatra={yatra} />
          </li>
        ))}
      </ul>

      <PhotoCredits yatras={shown} />

      <p className="by-city__more">
        <Link
          className="button button--plain button--large"
          to={`/yatras${filtersToSearch({ ...NO_FILTERS, startCity: city })}`}
        >
          {city === null ? `See all ${plural(leaving.length, 'yatra', 'yatras')}` : 'See all yatras'}
        </Link>
      </p>
    </div>
  );
}
