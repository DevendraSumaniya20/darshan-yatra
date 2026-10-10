import type { YatraSummary } from '../model/yatra';
import './PhotoCredits.css';

type PhotoCreditsProps = {
  yatras: readonly YatraSummary[];
};

/** Names the photographer and licence of every photograph shown in a list of yatras. */
export function PhotoCredits({ yatras }: PhotoCreditsProps) {
  const credited = yatras.flatMap((yatra) => (yatra.photo ? [{ yatra, photo: yatra.photo }] : []));
  if (credited.length === 0) return null;

  return (
    <details className="photo-credits">
      <summary>Photo credits</summary>
      <ul>
        {credited.map(({ yatra, photo }) => (
          <li key={yatra.id}>
            {yatra.name}: <a href={photo.sourceUrl}>{photo.credit}</a>
          </li>
        ))}
      </ul>
    </details>
  );
}
