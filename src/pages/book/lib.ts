// Time + date formatting helpers shared across the Book screen's components.
// Booking dates are ISO "yyyy-MM-dd" strings and slot times are "HH:mm" 24h
// strings — the same shapes the DataProvider hooks return and accept.

/** Parse an ISO date ("yyyy-MM-dd") as a local-midnight Date (no TZ shift). */
export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

function to12h(time: string): { hour: number; minute: string; period: "AM" | "PM" } {
  const [hRaw, mRaw] = time.split(":");
  const h = parseInt(hRaw, 10);
  return {
    hour: h % 12 || 12,
    minute: mRaw ?? "00",
    period: h < 12 ? "AM" : "PM",
  };
}

/** "15:00" → "3:00 PM" — used on the time-slot buttons and confirmation line. */
export function formatSlot12(time: string): string {
  const { hour, minute, period } = to12h(time);
  return `${hour}:${minute} ${period}`;
}

/** "15:00" → "3PM" — the compact form used inside the submit button label. */
export function formatSlotShort(time: string): string {
  const { hour, period } = to12h(time);
  return `${hour}${period}`;
}
