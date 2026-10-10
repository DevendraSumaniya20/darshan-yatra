import { useRef } from 'react';
import { NO_FILTERS, type YatraFilters } from '../../features/yatras/api/yatraGateway';
import { useStartCities, useYatras } from '../../features/yatras/api/useYatras';
import {
  groupByCircuit,
  searchSuggestions,
  searchYatras,
} from '../../features/yatras/model/catalogue';
import {
  filtersFromSearch,
  filtersToSearch,
  hasFilters,
  queryFromSearch,
} from '../../features/yatras/model/filters';
import { CatalogueQuestions } from '../../features/yatras/ui/CatalogueQuestions';
import { CircuitSection } from '../../features/yatras/ui/CircuitSection';
import { PhotoCredits } from '../../features/yatras/ui/PhotoCredits';
import { CircuitTabs } from '../../features/yatras/ui/CircuitTabs';
import { useCardEntrance } from '../../features/yatras/ui/useCardEntrance';
import { YatraFilterBar } from '../../features/yatras/ui/YatraFilterBar';
import { YatraSearch } from '../../features/yatras/ui/YatraSearch';
import { plural } from '../../shared/lib/format';
import { navigate, useLocation } from '../../shared/lib/router';
import { gsap, useGSAP, withMotion } from '../../shared/motion/gsap';
import { LoadingNotice, StatusMessage } from '../../shared/ui/StatusMessage';
import './YatrasPage.css';

/** With every circuit on the page, each shows one row of cards and links to the rest. */
const CARDS_PER_CIRCUIT = 3;

export function YatrasPage() {
  const { search } = useLocation();
  const filters = filtersFromSearch(search);
  const query = queryFromSearch(search);
  const yatras = useYatras(filters);
  const startCities = useStartCities();
  const root = useRef<HTMLDivElement>(null);

  // The list request returns the whole catalogue for the filters, so words are matched here.
  const matching = yatras.status === 'ready' ? searchYatras(yatras.data.items, query) : [];
  const groups = groupByCircuit(matching);
  const narrowed = hasFilters(filters) || query !== '';
  const shown = matching.map((yatra) => yatra.id).join(',');

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

  useCardEntrance(root, shown);

  function show(nextFilters: YatraFilters, nextQuery: string) {
    navigate(`/yatras${filtersToSearch(nextFilters, nextQuery)}`, { replace: true });
  }

  const clearAll = () => show(NO_FILTERS, '');

  return (
    <div className="yatras-page" ref={root}>
      <header className="yatras-page__head">
        <div className="page">
          <h1 className="sign yatras-page__title">All yatras</h1>
          <YatraSearch
            query={query}
            suggestions={searchSuggestions(yatras.data?.items ?? [])}
            onSearch={(nextQuery) => show(filters, nextQuery)}
          />
          <CircuitTabs filters={filters} query={query} />
          <YatraFilterBar
            filters={filters}
            startCities={startCities.data ?? []}
            onChange={(nextFilters) => show(nextFilters, query)}
            onClear={clearAll}
          />
        </div>
      </header>

      <div className="page yatras-page__status">
        <p className="yatras-page__count" role="status">
          {yatras.status === 'ready' &&
            (query
              ? `${plural(matching.length, 'yatra matches', 'yatras match')} “${query}”`
              : narrowed
                ? `${plural(matching.length, 'yatra matches', 'yatras match')} your filters`
                : plural(matching.length, 'yatra', 'yatras'))}
        </p>

        {query !== '' && matching.length > 0 && (
          <button className="button button--plain" type="button" onClick={() => show(filters, '')}>
            Clear search
          </button>
        )}

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

        {yatras.status === 'ready' && matching.length === 0 && (
          <StatusMessage
            title={query ? `No yatra matches “${query}”` : 'No yatra matches these filters'}
            action={
              <button className="button" type="button" onClick={clearAll}>
                {query ? 'Clear search and filters' : 'Clear filters'}
              </button>
            }
          >
            {query
              ? 'Search by a place on the route, such as Kedarnath, Dwarka or Tirupati, or by the city you leave from.'
              : 'Try another month or leaving city. Himalayan yatras only run from May to October.'}
          </StatusMessage>
        )}
      </div>

      <div className="yatras-page__circuits">
        {groups.map((group) => (
          <CircuitSection
            key={group.circuit}
            circuit={group.circuit}
            yatras={group.yatras}
            limit={filters.circuit === null ? CARDS_PER_CIRCUIT : null}
            allHref={`/yatras${filtersToSearch({ ...filters, circuit: group.circuit }, query)}`}
          />
        ))}
      </div>

      <CatalogueQuestions />

      <div className="page">
        <PhotoCredits yatras={matching} />
      </div>
    </div>
  );
}
