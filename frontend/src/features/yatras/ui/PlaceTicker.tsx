import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, withMotion } from '../../../shared/motion/gsap';
import './PlaceTicker.css';

const PLACES = [
  'Kedarnath',
  'Badrinath',
  'Gangotri',
  'Yamunotri',
  'Vaishno Devi',
  'Kashi Vishwanath',
  'Mahakaleshwar',
  'Omkareshwar',
  'Somnath',
  'Dwarka',
  'Shirdi',
  'Tirupati',
  'Rameswaram',
  'Madurai',
  'Kanyakumari',
] as const;

/** A slow band of the places the yatras visit. The second copy only fills the loop. */
export function PlaceTicker() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        const loop = gsap.to('.place-ticker__track', {
          xPercent: -50,
          duration: 55,
          ease: 'none',
          repeat: -1,
        });
        // Start deep into the loop so it can also run backwards.
        loop.totalTime(loop.duration() * 50);

        // Scrolling pushes the band along in the direction of travel, then it eases back.
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate(self) {
            const push = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 8);
            gsap.killTweensOf(loop);
            gsap
              .timeline()
              .to(loop, { timeScale: self.direction * push, duration: 0.2 })
              .to(loop, { timeScale: self.direction, duration: 1.4 }, '+=0.1');
          },
        });
      }),
    { scope: root },
  );

  return (
    <div className="place-ticker" ref={root}>
      <p className="visually-hidden">Places our yatras visit: {PLACES.join(', ')}.</p>
      <div className="place-ticker__track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <ul key={copy} className="place-ticker__group">
            {PLACES.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
