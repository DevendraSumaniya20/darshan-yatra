import { useState } from 'react';
import type { YatraSummary } from '../model/yatra';
import { CircuitPlate } from './art/CircuitPlate';
import './YatraPicture.css';

type YatraPictureProps = {
  yatra: Pick<YatraSummary, 'photo' | 'circuit'>;
  /** Pictures at the top of a page load at once; the rest wait until they are near the view. */
  eager?: boolean;
};

/** The yatra's photograph, or its circuit picture when there is none or it fails to load. */
export function YatraPicture({ yatra, eager = false }: YatraPictureProps) {
  const [failed, setFailed] = useState(false);

  if (yatra.photo === null || failed) {
    return <CircuitPlate circuit={yatra.circuit} className="yatra-picture" />;
  }

  return (
    <img
      className="yatra-picture"
      src={yatra.photo.path}
      alt={yatra.photo.alt}
      width={960}
      height={572}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
