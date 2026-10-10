import { formatInr, plural } from '../../../shared/lib/format';
import { DateSheet } from '../../../shared/ui/DateSheet';
import { Link } from '../../../shared/ui/Link';
import { seatsLabel, type YatraSummary } from '../model/yatra';
import { CircuitPlate } from './art/CircuitPlate';
import { YatraFacts } from './YatraFacts';
import './YatraRow.css';

type YatraRowProps = {
  yatra: YatraSummary;
};

export function YatraRow({ yatra }: YatraRowProps) {
  const next = yatra.nextDeparture;
  const href = `/yatras/${yatra.slug}`;

  return (
    <article className="yatra-row">
      <div className="yatra-row__picture">
        <CircuitPlate circuit={yatra.circuit} />
      </div>

      <div className="yatra-row__main">
        <h2 className="yatra-row__name">
          <Link to={href}>{yatra.name}</Link>
        </h2>
        <p>{yatra.summary}</p>
        <YatraFacts yatra={yatra} />
        <div className="yatra-row__buy">
          <p className="yatra-row__price">
            <span>from</span> <strong>{formatInr(yatra.fromPricePaise)}</strong>{' '}
            <span>per person</span>
          </p>
          <Link className="button" to={href}>
            See dates and plan
            <span className="visually-hidden"> for {yatra.name}</span>
          </Link>
        </div>
      </div>

      <div className="yatra-row__date">
        {next ? (
          <>
            <p className="yatra-row__date-label">
              {next.seatsLeft > 0 ? 'Next departure' : 'Next departure is full'}
            </p>
            <DateSheet date={next.startDate} size="small">
              <span className="yatra-row__seats">{seatsLabel(next)}</span>
            </DateSheet>
            {yatra.upcomingDepartureCount > 1 && (
              <p className="yatra-row__more">
                and {plural(yatra.upcomingDepartureCount - 1, 'more date', 'more dates')}
              </p>
            )}
          </>
        ) : (
          <p className="yatra-row__no-date">No dates fixed yet</p>
        )}
      </div>
    </article>
  );
}
