import { plural } from '../../../shared/lib/format';
import { Link } from '../../../shared/ui/Link';
import { CIRCUIT_INFO, CIRCUITS, type YatraSummary } from '../model/yatra';
import './CircuitList.css';

type CircuitListProps = {
  yatras: readonly YatraSummary[];
};

export function CircuitList({ yatras }: CircuitListProps) {
  return (
    <ul className="circuit-list">
      {CIRCUITS.map((circuit) => {
        const info = CIRCUIT_INFO[circuit];
        const count = yatras.filter((yatra) => yatra.circuit === circuit).length;
        return (
          <li key={circuit} className="circuit-list__row grid">
            <h3 className="sign circuit-list__name">{info.name}</h3>
            <p className="circuit-list__places">{info.places}</p>
            <p className="circuit-list__link">
              <Link to={`/yatras?circuit=${circuit}`}>
                {count > 0 ? `See ${plural(count, 'yatra', 'yatras')}` : 'See yatras'}
                <span className="visually-hidden"> in {info.name}</span>
              </Link>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
