import { formatInr, formatLongDate } from '../../../shared/lib/format';
import { DateSheet } from '../../../shared/ui/DateSheet';
import { seatsLabel, type Departure } from '../model/yatra';
import './DeparturePicker.css';

type DeparturePickerProps = {
  departures: readonly Departure[];
  selectedId: string | null;
  onSelect: (departureId: string) => void;
};

/** Departures as date-pad sheets. Open ones are radio choices; full ones are torn off. */
export function DeparturePicker({ departures, selectedId, onSelect }: DeparturePickerProps) {
  if (departures.length === 0) {
    return (
      <p className="departure-picker__empty">
        No departure dates are fixed for this yatra yet. Dates for the next season are added here as
        soon as they are set.
      </p>
    );
  }

  return (
    <fieldset className="departure-picker">
      <legend className="visually-hidden">Departure date</legend>
      <ul className="departure-picker__list">
        {departures.map((departure) => {
          if (departure.seatsLeft === 0) {
            return (
              <li key={departure.id} className="departure-picker__stub">
                <span>{formatLongDate(departure.startDate)}</span>
                <span className="departure-picker__full">Full</span>
              </li>
            );
          }

          return (
            <li key={departure.id}>
              <label className="departure-picker__option">
                <input
                  className="visually-hidden"
                  type="radio"
                  name="departure"
                  value={departure.id}
                  checked={departure.id === selectedId}
                  onChange={() => onSelect(departure.id)}
                />
                <DateSheet date={departure.startDate} size="small">
                  <span className="departure-picker__seats">{seatsLabel(departure)}</span>
                  <span>{formatInr(departure.pricePaise)}</span>
                  <span className="departure-picker__chosen" aria-hidden="true">
                    Chosen
                  </span>
                </DateSheet>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
