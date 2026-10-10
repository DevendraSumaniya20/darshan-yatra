import { useId, useRef, useState, type FormEvent, type InputHTMLAttributes } from 'react';
import { formatDateRange, formatInr, plural } from '../../../shared/lib/format';
import { ApiError } from '../../../shared/lib/http';
import { requestBooking } from '../api/bookingGateway';
import {
  EMPTY_DRAFT,
  maxTravellers,
  validateBooking,
  type BookableDeparture,
  type BookingConfirmation,
  type BookingDraft,
  type BookingErrors,
  type BookingField,
} from '../model/booking';
import './BookingForm.css';

type BookingFormProps = {
  departure: BookableDeparture;
  onBooked: (confirmation: BookingConfirmation) => void;
  /** Called when the server says seats changed, so the page can show fresh numbers. */
  onSeatsChanged: () => void;
};

const FIELD_ORDER: BookingField[] = ['contactName', 'phone', 'email', 'note'];

export function BookingForm({ departure, onBooked, onSeatsChanged }: BookingFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<BookingErrors>({});
  const [problem, setProblem] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const limit = maxTravellers(departure);
  // A newly chosen departure may have fewer seats than the number already picked.
  const travellers = Math.min(draft.travellers, limit);

  const clientErrors = validateBooking(draft);
  const errorFor = (field: BookingField): string | undefined =>
    serverErrors[field] ?? (touched[field] ? clientErrors[field] : undefined);

  function update<K extends BookingField>(field: K, value: BookingDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setServerErrors((current) => ({ ...current, [field]: undefined }));
  }

  function focusFirstInvalid(errors: BookingErrors) {
    const first = FIELD_ORDER.find((field) => errors[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (sending) return;

    setTouched({ contactName: true, phone: true, email: true, note: true });
    setProblem(null);
    if (Object.keys(clientErrors).length > 0) {
      focusFirstInvalid(clientErrors);
      return;
    }

    setSending(true);
    try {
      onBooked(await requestBooking(departure.id, { ...draft, travellers }));
    } catch (cause) {
      const error =
        cause instanceof ApiError
          ? cause
          : new ApiError('UNKNOWN', 'Something went wrong. Please try again.', 0);

      if (error.code === 'VALIDATION_FAILED') {
        setServerErrors(error.fields);
        focusFirstInvalid(error.fields);
        setProblem('Please check the marked fields and send again.');
      } else {
        setProblem(error.message);
        // Seats ran out or the date closed: show the current numbers.
        if (error.status === 409 || error.status === 404) onSeatsChanged();
      }
    } finally {
      setSending(false);
    }
  }

  function textField(
    field: 'contactName' | 'phone' | 'email',
    label: string,
    props: InputHTMLAttributes<HTMLInputElement>,
    hint?: string,
  ) {
    const error = errorFor(field);
    const describedBy = [hint && `${id}-${field}-hint`, error && `${id}-${field}-error`]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="field">
        <label className="field__label" htmlFor={`${id}-${field}`}>
          {label}
        </label>
        {hint && (
          <span className="field__hint" id={`${id}-${field}-hint`}>
            {hint}
          </span>
        )}
        <input
          {...props}
          className="field__control"
          id={`${id}-${field}`}
          name={field}
          value={draft[field]}
          onChange={(event) => update(field, event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, [field]: true }))}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
        />
        {error && (
          <span className="field__error" id={`${id}-${field}-error`}>
            {error}
          </span>
        )}
      </div>
    );
  }

  const noteError = errorFor('note');

  return (
    <form ref={formRef} className="booking-form" onSubmit={handleSubmit} noValidate>
      <p className="booking-form__dates">
        {formatDateRange(departure.startDate, departure.endDate)}
      </p>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-travellers`}>
          Travellers
        </label>
        <select
          className="field__control"
          id={`${id}-travellers`}
          name="travellers"
          value={travellers}
          onChange={(event) => update('travellers', Number(event.target.value))}
          aria-describedby={`${id}-travellers-hint`}
        >
          {Array.from({ length: limit }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
        <span className="field__hint" id={`${id}-travellers-hint`}>
          {departure.seatsLeft < 10
            ? `${plural(departure.seatsLeft, 'seat is', 'seats are')} left on this date.`
            : 'For more than 10 travellers, send a request and tell us in the note.'}
        </span>
      </div>

      {textField('contactName', 'Name of the person to call', { autoComplete: 'name' })}
      {textField(
        'phone',
        'Mobile number',
        { type: 'tel', inputMode: 'tel', autoComplete: 'tel-national' },
        'We call this number to confirm.',
      )}
      {textField('email', 'Email', { type: 'email', autoComplete: 'email' }, 'Optional')}

      <div className="field">
        <label className="field__label" htmlFor={`${id}-note`}>
          Note
        </label>
        <span className="field__hint" id={`${id}-note-hint`}>
          Optional. Ages, mobility or food needs we should plan for.
        </span>
        <textarea
          className="field__control"
          id={`${id}-note`}
          name="note"
          rows={3}
          value={draft.note}
          onChange={(event) => update('note', event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, note: true }))}
          aria-invalid={noteError ? true : undefined}
          aria-describedby={`${id}-note-hint${noteError ? ` ${id}-note-error` : ''}`}
        />
        {noteError && (
          <span className="field__error" id={`${id}-note-error`}>
            {noteError}
          </span>
        )}
      </div>

      <dl className="booking-form__total">
        <div>
          <dt>
            {plural(travellers, 'traveller', 'travellers')} at {formatInr(departure.pricePaise)}
          </dt>
          <dd>{formatInr(departure.pricePaise * travellers)}</dd>
        </div>
      </dl>

      {problem && (
        <p className="booking-form__problem" role="alert">
          {problem}
        </p>
      )}

      <button className="button booking-form__send" type="submit" aria-disabled={sending}>
        {sending ? 'Sending your request' : 'Send booking request'}
      </button>
      <p className="booking-form__after">
        Nothing is paid now. Your seats are held and our team calls you to confirm.
      </p>
    </form>
  );
}
