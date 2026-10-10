import { useEffect, useRef } from 'react';
import { formatDateRange, formatInr, plural } from '../../../shared/lib/format';
import { gsap, useGSAP, withMotion } from '../../../shared/motion/gsap';
import { Link } from '../../../shared/ui/Link';
import { formatMobile, type BookingConfirmation } from '../model/booking';
import './BookingReceipt.css';

type BookingReceiptProps = {
  confirmation: BookingConfirmation;
};

/** Shown in place of the form once a request is accepted. */
export function BookingReceipt({ confirmation }: BookingReceiptProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Screen readers and keyboard users land on the result, not on a vanished button.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const root = useRef<HTMLElement>(null);

  // The receipt lands like a stamped slip, then its lines are filled in.
  useGSAP(
    () =>
      withMotion(() => {
        gsap
          .timeline()
          .from(root.current, { scale: 0.8, rotation: -4, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' })
          .from('.booking-receipt__reference', { scaleX: 0, transformOrigin: '0 50%', duration: 0.5, ease: 'power3.out' }, '-=0.2')
          .from('.booking-receipt__details > div', { x: -16, opacity: 0, duration: 0.35, stagger: 0.06 }, '-=0.2');
      }),
    { scope: root },
  );

  return (
    <section className="booking-receipt" aria-labelledby="receipt-title" ref={root}>
      <h2 id="receipt-title" ref={headingRef} tabIndex={-1}>
        Booking request sent
      </h2>
      <p>
        Your seats are held. We will call {formatMobile(confirmation.phone)} to confirm the booking
        and explain payment.
      </p>

      <p className="booking-receipt__reference">
        <span>Your reference</span>
        <strong>{confirmation.reference}</strong>
      </p>

      <dl className="booking-receipt__details">
        <div>
          <dt>Yatra</dt>
          <dd>{confirmation.yatraName}</dd>
        </div>
        <div>
          <dt>Dates</dt>
          <dd>{formatDateRange(confirmation.startDate, confirmation.endDate)}</dd>
        </div>
        <div>
          <dt>Leaves from</dt>
          <dd>{confirmation.startCity}</dd>
        </div>
        <div>
          <dt>Travellers</dt>
          <dd>{plural(confirmation.travellers, 'person', 'people')}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>{formatInr(confirmation.totalPaise)}</dd>
        </div>
        <div>
          <dt>Name</dt>
          <dd>{confirmation.contactName}</dd>
        </div>
      </dl>

      <p className="booking-receipt__keep">
        Note the reference. Quote it when we call or if you need to change the booking.
      </p>
      <Link className="button button--plain" to="/yatras">
        See other yatras
      </Link>
    </section>
  );
}
