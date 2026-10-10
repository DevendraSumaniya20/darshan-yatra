import { useEffect, useRef } from 'react';
import { Link } from '../../../shared/ui/Link';
import type { YatraFilters } from '../api/yatraGateway';
import { filtersToSearch } from '../model/filters';
import { CIRCUIT_INFO, CIRCUITS, type Circuit } from '../model/yatra';
import { CircuitPlate } from './art/CircuitPlate';
import './CircuitTabs.css';

type CircuitTabsProps = {
  filters: YatraFilters;
};

/** Picture links for choosing a circuit; the other filters are kept. */
export function CircuitTabs({ filters }: CircuitTabsProps) {
  const nav = useRef<HTMLElement>(null);

  // On phones the tabs scroll sideways; keep the current one in view.
  useEffect(() => {
    nav.current
      ?.querySelector('[aria-current="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [filters.circuit]);

  const hrefFor = (circuit: Circuit | null) => `/yatras${filtersToSearch({ ...filters, circuit })}`;

  return (
    <nav className="circuit-tabs" aria-label="Circuits" ref={nav}>
      <ul>
        <li>
          <Link
            className="circuit-tabs__tab circuit-tabs__tab--all"
            to={hrefFor(null)}
            aria-current={filters.circuit === null ? 'true' : undefined}
          >
            <span className="circuit-tabs__name">All circuits</span>
          </Link>
        </li>
        {CIRCUITS.map((circuit) => (
          <li key={circuit}>
            <Link
              className="circuit-tabs__tab"
              to={hrefFor(circuit)}
              aria-current={filters.circuit === circuit ? 'true' : undefined}
            >
              <span className="circuit-tabs__picture">
                <CircuitPlate circuit={circuit} />
              </span>
              <span className="circuit-tabs__name">{CIRCUIT_INFO[circuit].name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
