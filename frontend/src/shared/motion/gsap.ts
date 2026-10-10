import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Animations are built only for people who have not asked for reduced motion. */
const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/**
 * Runs `build` when motion is welcome. Call inside `useGSAP` so everything it
 * creates is reverted on unmount; without motion the page stays in its final state.
 */
export function withMotion(build: () => void): void {
  gsap.matchMedia().add(MOTION_OK, build);
}

export function motionAllowed(): boolean {
  return window.matchMedia(MOTION_OK).matches;
}

export { gsap, ScrollTrigger, useGSAP };
