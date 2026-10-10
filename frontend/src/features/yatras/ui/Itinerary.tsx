import type { ItineraryDay } from '../model/yatra';
import './Itinerary.css';

type ItineraryProps = {
  days: readonly ItineraryDay[];
};

export function Itinerary({ days }: ItineraryProps) {
  return (
    <ol className="itinerary">
      {days.map((day) => (
        <li key={day.day} className="itinerary__day">
          <span className="itinerary__number" aria-hidden="true">
            {day.day}
          </span>
          <div>
            <h3>
              <span className="visually-hidden">Day {day.day}: </span>
              {day.title}
            </h3>
            <p>{day.description}</p>
            <p className="itinerary__night">
              {day.overnight ? `Night in ${day.overnight}` : 'The yatra ends today'}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
