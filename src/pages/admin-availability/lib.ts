import { format } from "date-fns";
import type { AvailabilityRow } from "@/lib/data-provider";

// Days rendered Monday → Sunday, though `day_of_week` follows JS convention
// (0 = Sunday … 6 = Saturday) to match the seed + Supabase schema.
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export const DAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

// The one editable row shape the page mutates. Times are held as the friendly
// display strings the coach types ("9:00 AM"); they convert to "HH:mm" on save.
export interface EditableDay {
  day_of_week: number;
  is_available: boolean;
  start_time: string;
  end_time: string;
}

/** "09:00" → "9:00 AM". Empty/invalid input returns "". */
export function to12Hour(hhmm: string | null | undefined): string {
  if (!hhmm) return "";
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!match) return "";
  const hour24 = Number(match[1]);
  const minutes = match[2];
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minutes} ${period}`;
}

/** "9:00 AM" → "09:00". Returns null if the text can't be parsed. */
export function to24Hour(display: string): string | null {
  const match = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(display.trim());
  if (!match) return null;
  let hour = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toLowerCase();
  if (hour < 1 || hour > 12 || minutes > 59) return null;
  if (period === "pm" && hour !== 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Merge the fetched schedule (which may be empty on a first-time account) into a
 * complete 7-row editable list ordered Monday → Sunday. Missing days default to
 * "off" with no hours — the spec's first-time state.
 */
export function buildEditableDays(rows: AvailabilityRow[]): EditableDay[] {
  const byDay = new Map(rows.map((r) => [r.day_of_week, r]));
  return DAY_ORDER.map((dow) => {
    const row = byDay.get(dow);
    return {
      day_of_week: dow,
      is_available: row?.is_available ?? false,
      start_time: to12Hour(row?.start_time),
      end_time: to12Hour(row?.end_time),
    };
  });
}

/** Format an ISO date ("2025-04-22") as "Tuesday, April 22" in local time. */
export function formatOverrideDate(iso: string): string {
  return format(new Date(`${iso}T00:00:00`), "EEEE, MMMM d");
}

export interface BufferOption {
  value: string;
  label: string;
}

export const BUFFER_OPTIONS: BufferOption[] = [
  { value: "0", label: "No minimum" },
  { value: "12", label: "12 hours" },
  { value: "24", label: "24 hours" },
  { value: "48", label: "48 hours" },
  { value: "72", label: "72 hours" },
];
