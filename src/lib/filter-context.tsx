import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";

// Shared filter state per docs/design/filters.md. Lives in context so a filter
// choice survives navigation between screens (e.g. the admin bookings tab stays
// put when you leave and return). Components read these values and pass them to
// DataProvider hooks — changing a filter re-renders → new hook call → new data.

export type BookingTab = "upcoming" | "past" | "cancelled";
export type MessageTab = "all" | "new" | "read";

interface FilterState {
  /** Admin Bookings tab (`useBookings`). */
  bookingTab: BookingTab;
  /** Admin Messages tab (`useMessages`). */
  messageTab: MessageTab;
  /** Month currently shown on the public /book calendar (`useAvailableSlots`). */
  bookingMonth: Date;
  /** Date selected on the /book calendar, ISO "YYYY-MM-DD" or null. */
  selectedDate: string | null;
}

interface FilterContextValue extends FilterState {
  setBookingTab: (tab: BookingTab) => void;
  setMessageTab: (tab: MessageTab) => void;
  setBookingMonth: (month: Date) => void;
  setSelectedDate: (date: string | null) => void;
  /** Derived first/last day of `bookingMonth` as ISO date strings. */
  monthRange: { monthStart: string; monthEnd: string };
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [bookingTab, setBookingTab] = useState<BookingTab>("upcoming");
  const [messageTab, setMessageTab] = useState<MessageTab>("new");
  const [bookingMonth, setBookingMonth] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthRange = useMemo(
    () => ({
      monthStart: format(startOfMonth(bookingMonth), "yyyy-MM-dd"),
      monthEnd: format(endOfMonth(bookingMonth), "yyyy-MM-dd"),
    }),
    [bookingMonth],
  );

  const value = useMemo<FilterContextValue>(
    () => ({
      bookingTab,
      messageTab,
      bookingMonth,
      selectedDate,
      setBookingTab,
      setMessageTab,
      setBookingMonth,
      setSelectedDate,
      monthRange,
    }),
    [bookingTab, messageTab, bookingMonth, selectedDate, monthRange],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be inside FilterProvider");
  return ctx;
}
