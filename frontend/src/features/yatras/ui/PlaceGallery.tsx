import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, withMotion } from '../../../shared/motion/gsap';
import type { GalleryPhoto } from '../model/yatra';
import './PlaceGallery.css';

type PlaceGalleryProps = {
  photos: readonly GalleryPhoto[];
};

/** Photographs of places on the route, each named and credited. Shows nothing when there are none. */
export function PlaceGallery({ photos }: PlaceGalleryProps) {
  const [failed, setFailed] = useState<readonly string[]>([]);
  const root = useRef<HTMLUListElement>(null);
  const shown = photos.filter((photo) => !failed.includes(photo.path));

  useGSAP(
    () =>
      withMotion(() => {
        // The same gesture as the picture plates: rise once, the picture settling from a zoom.
        gsap.set('.place-gallery__tile', { y: 40, opacity: 0 });
        ScrollTrigger.batch('.place-gallery__tile', {
          start: 'top 92%',
          once: true,
          onEnter: (tiles) => {
            gsap.to(tiles, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 });
            gsap.from(gsap.utils.toArray('.place-gallery__picture img', tiles), {
              scale: 1.2,
              duration: 1.2,
              ease: 'power3.out',
              stagger: 0.08,
            });
          },
        });
      }),
    { scope: root, dependencies: [shown.length], revertOnUpdate: true },
  );

  if (shown.length === 0) return null;

  return (
    <ul className="place-gallery" ref={root}>
      {shown.map((photo) => (
        <li key={photo.path}>
          <figure className="place-gallery__tile">
            <div className="place-gallery__picture">
              <img
                src={photo.path}
                alt={photo.alt}
                width={960}
                height={624}
                loading="lazy"
                decoding="async"
                onError={() => setFailed((paths) => [...paths, photo.path])}
              />
            </div>
            <figcaption className="place-gallery__caption">
              <span className="place-gallery__name">{photo.caption}</span>
              <span className="place-gallery__credit">
                Photo: <a href={photo.sourceUrl}>{photo.credit}</a>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
