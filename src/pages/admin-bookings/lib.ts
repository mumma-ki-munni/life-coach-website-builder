// Date + time formatting helpers for the Intake Requests screen. Booking dates
// are ISO "yyyy-MM-dd" strings and times are 24h "HH:mm" strings — the shapes
// the DataProvider hooks return.
import { format } from "date-fns";

/** Parse an ISO date ("yyyy-MM-dd") as a local-midnight Date (no TZ shift). */
export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/** "15:00" → "3:00 PM" */
export function formatTime12(time: string): string {
  const [hRaw, mRaw] = time.split(":");
  const h = parseInt(hRaw, 10);
  const hour = h % 12 || 12;
  const minute = mRaw ?? "00";
  const period = h < 12 ? "AM" : "PM";
  return `${hour}:${minute} ${period}`;
}

/** Table cell: "Apr 25, 3:00 PM" */
export function formatDateTimeShort(date: string, time: string): string {
  return `${format(parseISODate(date), "MMM d")}, ${formatTime12(time)}`;
}

/** Detail panel: "Friday, April 25, 2025" */
export function formatDateLong(date: string): string {
  return format(parseISODate(date), "EEEE, MMMM d, yyyy");
}
