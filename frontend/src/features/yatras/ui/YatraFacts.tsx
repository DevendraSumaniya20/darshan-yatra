import { altitudeLabel, DIFFICULTY_INFO, type YatraSummary } from '../model/yatra';
import './YatraFacts.css';

type YatraFactsProps = {
  yatra: YatraSummary;
};

/** The figures travellers compare: length, start city, walking, altitude, effort. */
export function YatraFacts({ yatra }: YatraFactsProps) {
  return (
    <dl className="yatra-facts">
      <div>
        <dt>Days</dt>
        <dd>{yatra.durationDays}</dd>
      </div>
      <div>
        <dt>Leaves from</dt>
        <dd>{yatra.startCity}</dd>
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
        <dt>Effort</dt>
        <dd>{DIFFICULTY_INFO[yatra.difficulty].label}</dd>
      </div>
    </dl>
  );
}
