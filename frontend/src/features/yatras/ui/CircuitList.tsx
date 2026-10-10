import { useRef } from 'react';
import { plural } from '../../../shared/lib/format';
import { gsap, useGSAP, withMotion } from '../../../shared/motion/gsap';
import { Link } from '../../../shared/ui/Link';
import { CIRCUIT_INFO, CIRCUITS, type YatraSummary } from '../model/yatra';
import { CircuitPlate } from './art/CircuitPlate';
import './CircuitList.css';

type CircuitListProps = {
  yatras: readonly YatraSummary[];
};

/** The four circuits as picture plates, each a link to its yatras. */
export function CircuitList({ yatras }: CircuitListProps) {
  const list = useRef<HTMLUListElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        const trigger = { trigger: list.current, start: 'top 82%', once: true };
        gsap.from('.circuit-list__item', {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: trigger,
        });
        gsap.from('.circuit-list__art', {
          scale: 1.3,
          duration: 1.6,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: trigger,
        });
      }),
    { scope: list },
  );

  return (
    <ul className="circuit-list" ref={list}>
      {CIRCUITS.map((circuit) => {
        const info = CIRCUIT_INFO[circuit];
        const count = yatras.filter((yatra) => yatra.circuit === circuit).length;
        return (
          <li key={circuit} className={`circuit-list__item circuit-list__item--${circuit}`}>
            <Link className="circuit-list__tile" to={`/yatras?circuit=${circuit}`}>
              <span className="circuit-list__picture">
                <span className="circuit-list__art">
                  <CircuitPlate circuit={circuit} />
                </span>
              </span>
              <span className="circuit-list__caption">
                <span className="circuit-list__name">{info.name}</span>
                <span className="circuit-list__places">{info.places}</span>
                <span className="circuit-list__count">
                  {count > 0 ? `See ${plural(count, 'yatra', 'yatras')}` : 'See yatras'}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
