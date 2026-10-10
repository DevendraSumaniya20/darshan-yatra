import { Link } from '../shared/ui/Link';
import './SiteFooter.css';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <p className="site-footer__name">Darshan Yatra</p>
        <p className="site-footer__line">Group pilgrimage tours on fixed dates.</p>
        <ul className="site-footer__links">
          <li>
            <Link to="/yatras">All yatras</Link>
          </li>
          <li>
            <Link to="/#how-booking-works">How booking works</Link>
          </li>
        </ul>
        <p className="site-footer__note">
          The yatras, prices and dates on this site are sample catalogue entries.
        </p>
      </div>
    </footer>
  );
}
