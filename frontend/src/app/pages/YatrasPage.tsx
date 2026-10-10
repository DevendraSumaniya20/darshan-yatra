import { NO_FILTERS, type YatraFilters } from '../../features/yatras/api/yatraGateway';
import { useStartCities, useYatras } from '../../features/yatras/api/useYatras';
import { filtersFromSearch, filtersToSearch, hasFilters } from '../../features/yatras/model/filters';
import { YatraFilterBar } from '../../features/yatras/ui/YatraFilterBar';
import { YatraRow } from '../../features/yatras/ui/YatraRow';
import { plural } from '../../shared/lib/format';
import { navigate, useLocation } from '../../shared/lib/router';
import { LoadingNotice, StatusMessage } from '../../shared/ui/StatusMessage';
import './YatrasPage.css';

export function YatrasPage() {
  const { search } = useLocation();
  const filters = filtersFromSearch(search);
  const yatras = useYatras(filters);
  const startCities = useStartCities();

  function applyFilters(next: YatraFilters) {
    navigate(`/yatras${filtersToSearch(next)}`, { replace: true });
  }

  const clearFilters = () => applyFilters(NO_FILTERS);

  return (
    <div className="page yatras-page">
      <h1 className="sign yatras-page__title">All yatras</h1>

      <YatraFilterBar
        filters={filters}
        startCities={startCities.data ?? []}
        onChange={applyFilters}
        onClear={clearFilters}
      />

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
  );
}
