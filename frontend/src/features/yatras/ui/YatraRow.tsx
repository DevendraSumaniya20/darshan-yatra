import { formatInr, plural } from '../../../shared/lib/format';
import { DateSheet } from '../../../shared/ui/DateSheet';
import { Link } from '../../../shared/ui/Link';
import { seatsLabel, type YatraSummary } from '../model/yatra';
import { YatraFacts } from './YatraFacts';
import './YatraRow.css';

type YatraRowProps = {
  yatra: YatraSummary;
};

export function YatraRow({ yatra }: YatraRowProps) {
  const next = yatra.nextDeparture;
  const href = `/yatras/${yatra.slug}`;

  return (
    <article className="yatra-row grid">
      <div className="yatra-row__date">
        {next ? (
          <>
            <p className="yatra-row__date-label">
              {next.seatsLeft > 0 ? 'Next departure' : 'Next departure is full'}
            </p>
            <DateSheet date={next.startDate} size="small">
              <span className="yatra-row__seats">{seatsLabel(next)}</span>
            </DateSheet>
          </>
        ) : (
          <p className="yatra-row__no-date">No dates fixed yet</p>
        )}
      </div>

      <div className="yatra-row__main">
        <h2 className="yatra-row__name">
          <Link to={href}>{yatra.name}</Link>
        </h2>
        <p>{yatra.summary}</p>
        <YatraFacts yatra={yatra} />
      </div>

      <div className="yatra-row__price">
        <p>
          <span className="yatra-row__from">from</span>{' '}
          <span className="yatra-row__amount">{formatInr(yatra.fromPricePaise)}</span>{' '}
          <span className="yatra-row__per">per person</span>
        </p>
        {yatra.upcomingDepartureCount > 0 && (
          <p className="yatra-row__count">
            {plural(yatra.upcomingDepartureCount, 'date', 'dates')} open
          </p>
        )}
        <Link className="button" to={href}>
          See dates and plan
          <span className="visually-hidden"> for {yatra.name}</span>
        </Link>
      </div>
    </article>
  );
}
