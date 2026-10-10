import { plural } from '../../../shared/lib/format';
import { Link } from '../../../shared/ui/Link';
import { CIRCUIT_INFO, type Circuit, type YatraSummary } from '../model/yatra';
import { YatraCard } from './YatraCard';
import './CircuitSection.css';

type CircuitSectionProps = {
  circuit: Circuit;
  yatras: readonly YatraSummary[];
  /** How many cards to show before linking to the rest; `null` shows them all. */
  limit: number | null;
  allHref: string;
};

/** One band of the catalogue: a circuit, where it goes, and its yatras as cards. */
export function CircuitSection({ circuit, yatras, limit, allHref }: CircuitSectionProps) {
  const info = CIRCUIT_INFO[circuit];
  const shown = limit === null ? yatras : yatras.slice(0, limit);
  const titleId = `circuit-${circuit}`;

  return (
    <section className="circuit-section" aria-labelledby={titleId}>
      <div className="page">
        <div className="circuit-section__head">
          <h2 id={titleId} className="sign circuit-section__title">
            {info.name}
          </h2>
          <p className="circuit-section__count">{plural(yatras.length, 'yatra', 'yatras')}</p>
          <p className="circuit-section__places">{info.places}</p>
        </div>

        <ul className="circuit-section__cards">
          {shown.map((yatra) => (
            <li key={yatra.id}>
              <YatraCard yatra={yatra} />
            </li>
          ))}
        </ul>

        {shown.length < yatras.length && (
          <p className="circuit-section__more">
            <Link className="button button--plain" to={allHref}>
              See all {yatras.length} yatras in {info.name}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
