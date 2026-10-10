import { formatInr, plural } from '../../../shared/lib/format';
import { DateSheet } from '../../../shared/ui/DateSheet';
import { Link } from '../../../shared/ui/Link';
import { DIFFICULTY_INFO, seatsLabel, type YatraSummary } from '../model/yatra';
import { YatraPicture } from './YatraPicture';
import './YatraCard.css';

type YatraCardProps = {
  yatra: YatraSummary;
};

/** One yatra as a small trade calendar: picture above, the next date sheet below. */
export function YatraCard({ yatra }: YatraCardProps) {
  const next = yatra.nextDeparture;
  const href = `/yatras/${yatra.slug}`;

  return (
    <article className="yatra-card">
      <div className="yatra-card__picture">
        <YatraPicture yatra={yatra} />
        <p className="yatra-card__length">{plural(yatra.durationDays, 'day', 'days')}</p>
      </div>

      <div className="yatra-card__body">
        <h3 className="yatra-card__name">
          <Link to={href}>{yatra.name}</Link>
        </h3>
        <p className="yatra-card__places">{yatra.places.join(', ')}</p>

        <div className="yatra-card__when">
          {next ? (
            <div className="yatra-card__date">
              <p className="yatra-card__date-label">
                {next.seatsLeft > 0 ? 'Next departure' : 'Next departure is full'}
              </p>
              <DateSheet date={next.startDate} size="small">
                <span className="yatra-card__seats">{seatsLabel(next)}</span>
              </DateSheet>
            </div>
          ) : (
            <p className="yatra-card__no-date">No dates fixed yet</p>
          )}

          <dl className="yatra-card__facts">
            <div>
              <dt>Leaves from</dt>
              <dd>{yatra.startCity}</dd>
            </div>
            <div>
              <dt>On foot</dt>
              <dd>{yatra.walkingKm} km</dd>
            </div>
            <div>
              <dt>Effort</dt>
              <dd>{DIFFICULTY_INFO[yatra.difficulty].label}</dd>
            </div>
            {yatra.upcomingDepartureCount > 1 && (
              <div>
                <dt>Other dates</dt>
                <dd>{yatra.upcomingDepartureCount - 1}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="yatra-card__buy">
          <p className="yatra-card__price">
            <span>from</span> <strong>{formatInr(yatra.fromPricePaise)}</strong>{' '}
            <span>per person</span>
          </p>
          <Link className="button" to={href}>
            See dates and plan
            <span className="visually-hidden"> for {yatra.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
