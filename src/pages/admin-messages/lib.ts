// Date formatting helpers for the Messages screen. Contact messages carry an
// ISO timestamp `created_at` (e.g. "2025-04-18T10:30:00Z") — the shape the
// DataProvider hooks return.
import { format } from "date-fns";

/** Table cell: "Apr 18" */
export function formatMessageDateShort(iso: string): string {
  return format(new Date(iso), "MMM d");
}

/** Detail panel: "Apr 18, 2025" */
export function formatMessageDateLong(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy");
}
