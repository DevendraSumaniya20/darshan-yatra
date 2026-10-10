import { Link } from '../shared/ui/Link';
import './SiteHeader.css';

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__skip" href="#main">
        Skip to content
      </a>
      <div className="page site-header__bar">
        <Link className="site-header__name" to="/">
          Darshan Yatra
        </Link>
        <nav aria-label="Main">
          <ul className="site-header__links">
            <li>
              <Link to="/yatras">All yatras</Link>
            </li>
            <li>
              <Link to="/#how-booking-works">How booking works</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
