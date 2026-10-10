import type { CSSProperties } from 'react';
import { formatInr, plural } from '../../../shared/lib/format';
import { DateSheet } from '../../../shared/ui/DateSheet';
import { Link } from '../../../shared/ui/Link';
import { nextDepartures, seatsLabel, type YatraSummary } from '../model/yatra';
import './NextDeparturesPad.css';

type NextDeparturesPadProps = {
  yatras: readonly YatraSummary[];
};

/** The soonest departures with seats, hung as a row of date-pad sheets. */
export function NextDeparturesPad({ yatras }: NextDeparturesPadProps) {
  const upcoming = nextDepartures(yatras, 4);

  if (upcoming.length === 0) {
    return (
      <p className="next-pad__empty">
        No departures are open for booking right now. New dates are added to each yatra as they are
        fixed.
      </p>
    );
  }

  return (
    <ul className="next-pad">
      {upcoming.map(({ yatra, departure }, index) => (
        <li key={departure.id} style={{ '--order': index } as CSSProperties}>
          <Link className="next-pad__sheet" to={`/yatras/${yatra.slug}?departure=${departure.id}`}>
            <DateSheet date={departure.startDate}>
              <span className="next-pad__name">{yatra.name}</span>
              <span>
                {plural(yatra.durationDays, 'day', 'days')} from {yatra.startCity}
              </span>
              <span className="next-pad__seats">{seatsLabel(departure)}</span>
              <span>{formatInr(departure.pricePaise)} per person</span>
            </DateSheet>
          </Link>
        </li>
      ))}
    </ul>
  );
}
