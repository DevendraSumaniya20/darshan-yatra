import { useRef } from 'react';
import { NO_FILTERS, type YatraFilters } from '../../features/yatras/api/yatraGateway';
import { useStartCities, useYatras } from '../../features/yatras/api/useYatras';
import { filtersFromSearch, filtersToSearch, hasFilters } from '../../features/yatras/model/filters';
import { CircuitTabs } from '../../features/yatras/ui/CircuitTabs';
import { YatraFilterBar } from '../../features/yatras/ui/YatraFilterBar';
import { YatraRow } from '../../features/yatras/ui/YatraRow';
import { plural } from '../../shared/lib/format';
import { navigate, useLocation } from '../../shared/lib/router';
import { gsap, ScrollTrigger, useGSAP, withMotion } from '../../shared/motion/gsap';
import { LoadingNotice, StatusMessage } from '../../shared/ui/StatusMessage';
import './YatrasPage.css';

export function YatrasPage() {
  const { search } = useLocation();
  const filters = filtersFromSearch(search);
  const yatras = useYatras(filters);
  const startCities = useStartCities();
  const root = useRef<HTMLDivElement>(null);
  const shown = yatras.data?.items.map((yatra) => yatra.id).join(',') ?? '';

  useGSAP(
    () =>
      withMotion(() => {
        gsap.from('.circuit-tabs li', {
          y: 26,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.06,
        });
      }),
    { scope: root },
  );

  // Rows rise into place as they come into view; rebuilt whenever the list changes.
  useGSAP(
    () =>
      withMotion(() => {
        gsap.set('.yatra-row', { y: 60, opacity: 0 });
        ScrollTrigger.batch('.yatra-row', {
          start: 'top 94%',
          once: true,
          onEnter: (rows) =>
            gsap.to(rows, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }),
        });
      }),
    { scope: root, dependencies: [shown], revertOnUpdate: true },
  );

  function applyFilters(next: YatraFilters) {
    navigate(`/yatras${filtersToSearch(next)}`, { replace: true });
  }

  const clearFilters = () => applyFilters(NO_FILTERS);

  return (
    <div className="yatras-page" ref={root}>
      <header className="yatras-page__head">
        <div className="page">
          <h1 className="sign yatras-page__title">All yatras</h1>
          <CircuitTabs filters={filters} />
          <YatraFilterBar
            filters={filters}
            startCities={startCities.data ?? []}
            onChange={applyFilters}
            onClear={clearFilters}
          />
        </div>
      </header>

      <div className="page">
        <p className="yatras-page__count" role="status">
          {yatras.status === 'ready' &&
            (hasFilters(filters)
              ? `${plural(yatras.data.total, 'yatra matches', 'yatras match')} your filters`
              : plural(yatras.data.total, 'yatra', 'yatras'))}
        </p>

        {yatras.status === 'loading' && <LoadingNotice label="Loading yatras" />}

        {yatras.status === 'error' && (
          <StatusMessage
            tone="problem"
            title="The yatra list did not load"
            action={
              <button className="button button--plain" type="button" onClick={yatras.reload}>
                Try again
              </button>
            }
          >
            {yatras.error.message}
          </StatusMessage>
        )}

        {yatras.status === 'ready' && yatras.data.items.length === 0 && (
          <StatusMessage
            title="No yatra matches these filters"
            action={
              <button className="button" type="button" onClick={clearFilters}>
                Clear filters
              </button>
            }
          >
            Try another month or leaving city. Himalayan yatras only run from May to October.
          </StatusMessage>
        )}

        {yatras.status === 'ready' && yatras.data.items.length > 0 && (
          <ul className="yatras-page__list">
            {yatras.data.items.map((yatra) => (
              <li key={yatra.id}>
                <YatraRow yatra={yatra} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
