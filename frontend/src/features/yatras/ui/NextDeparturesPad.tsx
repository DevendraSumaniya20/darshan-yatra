import { useRef } from 'react';
import { formatInr, plural } from '../../../shared/lib/format';
import { gsap, useGSAP, withMotion } from '../../../shared/motion/gsap';
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
  const list = useRef<HTMLUListElement>(null);

  // The sheets swing to rest as the pad is hung.
  useGSAP(
    () =>
      withMotion(() => {
        gsap.from('.next-pad__sheet', {
          rotation: -10,
          y: -40,
          opacity: 0,
          transformOrigin: '50% 0%',
          duration: 1.4,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.11,
          scrollTrigger: { trigger: list.current, start: 'top 88%', once: true },
        });
      }),
    { scope: list, dependencies: [upcoming.length] },
  );

  if (upcoming.length === 0) {
    return (
      <p className="next-pad__empty">
        No departures are open for booking right now. New dates are added to each yatra as they are
        fixed.
      </p>
    );
  }

  return (
    <ul className="next-pad" ref={list}>
      {upcoming.map(({ yatra, departure }) => (
        <li key={departure.id}>
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
