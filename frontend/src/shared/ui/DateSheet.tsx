import type { ReactNode } from 'react';
import { dateParts } from '../lib/format';
import './DateSheet.css';

type DateSheetProps = {
  /** Calendar date as `YYYY-MM-DD`. */
  date: string;
  size?: 'regular' | 'small';
  children?: ReactNode;
};

/** One sheet of a tear-off date pad: month band, large day numeral, weekday. */
export function DateSheet({ date, size = 'regular', children }: DateSheetProps) {
  const { day, weekday, monthYear } = dateParts(date);

  return (
    <div className={`date-sheet date-sheet--${size}`}>
      <time className="date-sheet__date" dateTime={date}>
        <span className="date-sheet__month">{monthYear}</span>
        <span className="date-sheet__day">{day}</span>
        <span className="date-sheet__weekday">{weekday}</span>
      </time>
      {children ? <div className="date-sheet__body">{children}</div> : null}
    </div>
  );
}
