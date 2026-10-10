import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP, withMotion } from '../../../shared/motion/gsap';

/**
 * Yatra cards inside `scope` rise into place as they come into view and their
 * date sheets swing to rest. Rebuilt whenever `shown` changes.
 */
export function useCardEntrance(scope: RefObject<HTMLElement | null>, shown: string): void {
  useGSAP(
    () =>
      withMotion(() => {
        gsap.set('.yatra-card', { y: 60, opacity: 0 });
        ScrollTrigger.batch('.yatra-card', {
          start: 'top 94%',
          once: true,
          onEnter: (cards) => {
            gsap.to(cards, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 });
            gsap.from(gsap.utils.toArray('.date-sheet', cards), {
              rotation: -9,
              duration: 1.3,
              ease: 'elastic.out(1, 0.5)',
              stagger: 0.1,
              delay: 0.2,
            });
          },
        });
      }),
    { scope, dependencies: [shown], revertOnUpdate: true },
  );
}
