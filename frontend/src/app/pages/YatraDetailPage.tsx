import { useState } from 'react';
import { useYatra } from '../../features/yatras/api/useYatras';
import {
  altitudeLabel,
  CIRCUIT_INFO,
  DIFFICULTY_INFO,
  seasonLabel,
  type YatraDetail,
} from '../../features/yatras/model/yatra';
import { DeparturePicker } from '../../features/yatras/ui/DeparturePicker';
import { Itinerary } from '../../features/yatras/ui/Itinerary';
import { formatInr } from '../../shared/lib/format';
import { useLocation } from '../../shared/lib/router';
import { Link } from '../../shared/ui/Link';
import { LoadingNotice, StatusMessage } from '../../shared/ui/StatusMessage';
import { NotFoundPage } from './NotFoundPage';
import './YatraDetailPage.css';

type YatraDetailPageProps = {
  slug: string;
};

export function YatraDetailPage({ slug }: YatraDetailPageProps) {
  const yatra = useYatra(slug);

  if (yatra.status === 'loading') {
    return (
      <div className="page">
        <LoadingNotice label="Loading the yatra" />
      </div>
    );
  }

  if (yatra.status === 'error') {
    if (yatra.error.status === 404 || yatra.error.status === 400) return <NotFoundPage />;
    return (
      <div className="page yatra-detail">
        <StatusMessage
          tone="problem"
          title="This yatra did not load"
          action={
            <button className="button button--plain" type="button" onClick={yatra.reload}>
              Try again
            </button>
          }
        >
          {yatra.error.message}
        </StatusMessage>
      </div>
    );
  }

  return <YatraDetailView yatra={yatra.data} />;
}

function YatraDetailView({ yatra }: { yatra: YatraDetail }) {
  const { search } = useLocation();
  const requested = new URLSearchParams(search).get('departure');
  const [chosenId, setChosenId] = useState<string | null>(requested);

  // Fall back to the first open date when nothing valid is chosen.
  const open = yatra.departures.filter((departure) => departure.seatsLeft > 0);
  const selected = open.find((departure) => departure.id === chosenId) ?? open[0] ?? null;

  const difficulty = DIFFICULTY_INFO[yatra.difficulty];

  return (
    <article className="yatra-detail">
      <header className="yatra-detail__head">
        <div className="page">
          <p className="yatra-detail__back">
            <Link to={`/yatras?circuit=${yatra.circuit}`}>{CIRCUIT_INFO[yatra.circuit].name}</Link>
          </p>
          <h1 className="sign yatra-detail__title">{yatra.name}</h1>
          <p className="lede">{yatra.summary}</p>

          <dl className="yatra-detail__facts">
            <div>
              <dt>Days</dt>
              <dd>{yatra.durationDays}</dd>
            </div>
            <div>
              <dt>Starts in</dt>
              <dd>{yatra.startCity}</dd>
            </div>
            <div>
              <dt>Ends in</dt>
              <dd>{yatra.endCity}</dd>
            </div>
            <div>
              <dt>On foot</dt>
              <dd>{yatra.walkingKm} km</dd>
            </div>
            <div>
              <dt>Highest point</dt>
              <dd>{altitudeLabel(yatra.maxAltitudeM)}</dd>
            </div>
            <div>
              <dt>Season</dt>
              <dd>{seasonLabel(yatra.seasonStartMonth, yatra.seasonEndMonth)}</dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>{formatInr(yatra.fromPricePaise)} per person</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="page grid yatra-detail__body">
        <div className="yatra-detail__plan">
          <section aria-labelledby="effort-title" className="yatra-detail__effort">
            <h2 id="effort-title">Effort: {difficulty.label.toLowerCase()}</h2>
            <p>{difficulty.meaning}</p>
            {yatra.maxAltitudeM !== null && yatra.maxAltitudeM >= 3000 && (
              <p>
                Travellers with heart or breathing conditions should ask their doctor before
                booking.
              </p>
            )}
          </section>

          <section aria-labelledby="plan-title">
            <h2 id="plan-title" className="section__title">
              Day by day
            </h2>
            <Itinerary days={yatra.itinerary} />
          </section>

          <section aria-labelledby="price-title" className="yatra-detail__covers">
            <h2 id="price-title" className="section__title">
              What the price covers
            </h2>
            <div className="yatra-detail__lists">
              <div>
                <h3>Included</h3>
                <ul>
                  {yatra.inclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Not included</h3>
                <ul>
                  {yatra.exclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <aside className="yatra-detail__book" aria-labelledby="dates-title">
          <h2 id="dates-title">Choose a departure</h2>
          <DeparturePicker
            departures={yatra.departures}
            selectedId={selected?.id ?? null}
            onSelect={setChosenId}
          />
        </aside>
      </div>
    </article>
  );
}
