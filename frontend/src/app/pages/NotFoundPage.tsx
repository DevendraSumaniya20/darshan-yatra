import { Link } from '../../shared/ui/Link';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <div className="page not-found">
      <h1 className="sign not-found__title">This page is not on the calendar</h1>
      <p className="lede">
        The address may be mistyped, or the yatra may no longer be running. Every yatra with open
        dates is on the list.
      </p>
      <Link className="button" to="/yatras">
        See all yatras
      </Link>
    </div>
  );
}
