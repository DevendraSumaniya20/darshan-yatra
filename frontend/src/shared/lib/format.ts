const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatInr(paise: number): string {
  return rupees.format(paise / 100);
}

/** Calendar dates arrive as `YYYY-MM-DD`; reading them as UTC keeps the day stable in any zone. */
function utc(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

function formatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'UTC', ...options });
}

const dayFormat = formatter({ day: 'numeric' });
const weekdayFormat = formatter({ weekday: 'long' });
const monthYearFormat = formatter({ month: 'short', year: 'numeric' });
const longFormat = formatter({ day: 'numeric', month: 'long', year: 'numeric' });
const shortFormat = formatter({ day: 'numeric', month: 'short' });
const monthNameFormat = formatter({ month: 'long' });
const monthLabelFormat = formatter({ month: 'long', year: 'numeric' });

export function dateParts(isoDate: string): { day: string; weekday: string; monthYear: string } {
  const date = utc(isoDate);
  return {
    day: dayFormat.format(date),
    weekday: weekdayFormat.format(date),
    monthYear: monthYearFormat.format(date),
  };
}

export function formatLongDate(isoDate: string): string {
  return longFormat.format(utc(isoDate));
}

/** "8 May to 17 May 2027" */
export function formatDateRange(startIso: string, endIso: string): string {
  if (startIso === endIso) return formatLongDate(startIso);
  return `${shortFormat.format(utc(startIso))} to ${longFormat.format(utc(endIso))}`;
}

export function monthName(month: number): string {
  return monthNameFormat.format(new Date(Date.UTC(2026, month - 1, 1)));
}

/** "2026-11" becomes "November 2026". */
export function formatMonth(yearMonth: string): string {
  return monthLabelFormat.format(utc(`${yearMonth}-01`));
}

export function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}
