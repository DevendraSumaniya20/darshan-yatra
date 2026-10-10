import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { gsap, motionAllowed, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

/** Smooth wheel scrolling, driven by the same clock as the scroll animations. */
export function useSmoothScroll(): void {
  useEffect(() => {
    if (!motionAllowed()) return;

    const instance = new Lenis({ autoRaf: false, anchors: true, lerp: 0.11 });
    lenis = instance;
    instance.on('scroll', ScrollTrigger.update);

    const tick = (time: number): void => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);
}

export function jumpToTop(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function scrollToElement(element: HTMLElement): void {
  if (lenis) lenis.scrollTo(element, { offset: -24 });
  else element.scrollIntoView();
}
