import { useRef } from 'react';
import { NO_FILTERS, type YatraFilters } from '../../features/yatras/api/yatraGateway';
import { useYatras } from '../../features/yatras/api/useYatras';
import { leavingCities, searchSuggestions } from '../../features/yatras/model/catalogue';
import { filtersToSearch } from '../../features/yatras/model/filters';
import { Panorama } from '../../features/yatras/ui/art/Panorama';
import { CircuitList } from '../../features/yatras/ui/CircuitList';
import { NextDeparturesPad } from '../../features/yatras/ui/NextDeparturesPad';
import { PlaceTicker } from '../../features/yatras/ui/PlaceTicker';
import { YatraFinder } from '../../features/yatras/ui/YatraFinder';
import { YatrasByCity } from '../../features/yatras/ui/YatrasByCity';
import { navigate } from '../../shared/lib/router';
import { gsap, useGSAP, withMotion } from '../../shared/motion/gsap';
import { Link } from '../../shared/ui/Link';
import { LoadingNotice, StatusMessage } from '../../shared/ui/StatusMessage';
import './HomePage.css';

const HEADLINE = ['Group', 'yatras', 'on', 'fixed', 'dates'];

export function HomePage() {
  const yatras = useYatras(NO_FILTERS);
  const root = useRef<HTMLDivElement>(null);
  const catalogue = yatras.data?.items ?? [];

  function find(filters: YatraFilters, query: string) {
    navigate(`/yatras${filtersToSearch(filters, query)}`);
  }

  useGSAP(
    () =>
      withMotion(() => {
        // The picture is printed in passes: headline, then sun, hills and shrines rising in turn.
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero__word', { yPercent: 70, opacity: 0, rotation: 5, duration: 0.8, stagger: 0.07 })
          .from('.hero__lede, .hero__actions', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.45')
          .from('.pano-sun', { y: 200, duration: 1.6, ease: 'power2.out' }, 0.1)
          .from('.pano-far', { y: 250, duration: 1.1 }, 0.25)
          .from('.pano-rise', { y: 270, duration: 0.9, stagger: 0.06, ease: 'back.out(1.3)' }, 0.45)
          .from('.pano-boat', { x: -280, duration: 1.8, ease: 'power1.out' }, 0.9);

        // The wave pattern repeats every 72 units, so this drift loops without a seam.
        gsap.to('.pano-waves', { x: 72, duration: 7, ease: 'none', repeat: -1 });

        gsap.to('.hero__copy', {
          y: -50,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        for (const group of ['.how-it-works__steps > li', '.before-you-choose > div']) {
          gsap.from(group, {
            y: 46,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.14,
            scrollTrigger: { trigger: group, start: 'top 86%', once: true },
          });
        }
      }),
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="hero">
        <div className="hero__plate">
          <div className="page hero__copy">
            <h1 className="sign hero__title">
              {HEADLINE.map((word) => (
                <span key={word} className="hero__word">
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="lede hero__lede">
              Every departure shows its seats left and its price per person. Pick a date, read the
              day-by-day plan, and request your seats.
            </p>
            <div className="hero__actions">
              <Link className="button button--large" to="/yatras">
                See all dates
              </Link>
              <Link className="button button--plain button--large" to="/#how-booking-works">
                How booking works
              </Link>
            </div>
          </div>
          <Panorama className="hero__art" />
        </div>
      </section>

      <div className="finder">
        <div className="page">
          <YatraFinder
            cities={leavingCities(catalogue)}
            suggestions={searchSuggestions(catalogue)}
            onFind={find}
          />
        </div>
      </div>

      <section className="leaving" aria-labelledby="leaving-title">
        <div className="page">
          <div className="leaving__head">
            <h2 id="leaving-title" className="leaving__title">
              Leaving next
            </h2>
            <Link className="leaving__all" to="/yatras">
              All yatras and dates
            </Link>
          </div>
          {yatras.status === 'loading' && <LoadingNotice label="Loading the next departures" />}
          {yatras.status === 'error' && (
            <StatusMessage
              tone="problem"
              title="The departure dates did not load"
              action={
                <button className="button button--plain" type="button" onClick={yatras.reload}>
                  Try again
                </button>
              }
            >
              {yatras.error.message}
            </StatusMessage>
          )}
          {yatras.status === 'ready' && <NextDeparturesPad yatras={yatras.data.items} />}
        </div>
      </section>

      <PlaceTicker />

      {catalogue.length > 0 && (
        <section className="section page" aria-labelledby="by-city-title">
          <h2 id="by-city-title" className="section__title">
            Yatras by leaving city
          </h2>
          <YatrasByCity yatras={catalogue} />
        </section>
      )}

      <section className="section circuits" aria-labelledby="circuits-title">
        <div className="page">
          <h2 id="circuits-title" className="section__title">
            Four circuits
          </h2>
          <CircuitList yatras={catalogue} />
        </div>
      </section>

      <section
        id="how-booking-works"
        className="section how-it-works"
        aria-labelledby="how-title"
      >
        <div className="page">
          <h2 id="how-title" className="section__title">
            How booking works
          </h2>
          <ol className="grid how-it-works__steps">
            <li>
              <h3>Pick a departure</h3>
              <p>Each yatra lists its dates with the seats left and the price per person.</p>
            </li>
            <li>
              <h3>Send a booking request</h3>
              <p>
                Tell us who to call and how many are travelling. Your seats are held as soon as the
                request is sent.
              </p>
            </li>
            <li>
              <h3>We call to confirm</h3>
              <p>
                Our team phones you to confirm the booking and explain payment. Nothing is paid on
                this site.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section page" aria-labelledby="know-title">
        <h2 id="know-title" className="section__title">
          Before you choose
        </h2>
        <div className="grid before-you-choose">
          <div>
            <h3>Walking and altitude</h3>
            <p>
              Each yatra states the total distance on foot and the highest point reached. Kedarnath
              and Yamunotri each need a full day of walking above 3,000 m.
            </p>
          </div>
          <div>
            <h3>What the price covers</h3>
            <p>
              Hotels on twin sharing, breakfast and dinner, and road transport for the route. Travel
              to the start city is not included. Each yatra lists both in full.
            </p>
          </div>
          <div>
            <h3>Seasons</h3>
            <p>
              The Himalayan shrines open from May to October. Most other circuits run from October
              to March, and a few run all year.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
