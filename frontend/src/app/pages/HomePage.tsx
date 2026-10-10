import { NO_FILTERS } from '../../features/yatras/api/yatraGateway';
import { useYatras } from '../../features/yatras/api/useYatras';
import { CircuitList } from '../../features/yatras/ui/CircuitList';
import { NextDeparturesPad } from '../../features/yatras/ui/NextDeparturesPad';
import { Link } from '../../shared/ui/Link';
import { LoadingNotice, StatusMessage } from '../../shared/ui/StatusMessage';
import './HomePage.css';

export function HomePage() {
  const yatras = useYatras(NO_FILTERS);

  return (
    <>
      <section className="hero">
        <div className="hero__plate">
          <div className="page">
            <div className="grid hero__top">
              <h1 className="sign hero__title">Group yatras on fixed dates</h1>
              <div className="hero__intro">
                <p className="lede">
                  Every departure shows its seats left and its price per person. Pick a date, read
                  the day-by-day plan, and request your seats.
                </p>
                <Link className="button" to="/yatras">
                  See all dates
                </Link>
              </div>
            </div>

            <h2 className="hero__pad-title">Leaving next</h2>
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
        </div>
      </section>

      <section className="section page" aria-labelledby="circuits-title">
        <h2 id="circuits-title" className="section__title">
          Four circuits
        </h2>
        <CircuitList yatras={yatras.data?.items ?? []} />
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
    </>
  );
}
