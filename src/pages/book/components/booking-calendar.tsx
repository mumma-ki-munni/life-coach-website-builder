import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useDataProvider } from "@/lib/data-provider";
import { cn } from "@/lib/utils";
import { formatSlot12, parseISODate } from "../lib";

interface BookingCalendarProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  selectedDate: string | undefined;
  onSelectDate: (date: string) => void;
  selectedTime: string | undefined;
  onSelectTime: (time: string) => void;
  /**
   * Drop the page-width wrapper so the parent owns the layout — used by the
   * first-time two-up (pitch left, calendar right). Once a date is picked the
   * page reverts to a full-width calendar + time-slots layout (bare=false).
   */
  bare?: boolean;
}

function CalendarSkeleton() {
  return (
    <div className="border border-border p-6">
      <div className="mx-auto h-5 w-32 rounded bg-muted" />
      <div className="mt-6 grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="aspect-square rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
      <span className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-foreground" aria-hidden="true" />
        Available
      </span>
      <span className="flex items-center gap-2">
        <span
          className="size-2 rounded-full border border-muted-foreground"
          aria-hidden="true"
        />
        Unavailable
      </span>
    </div>
  );
}

function TimeSlots({
  selectedDate,
  slots,
  selectedTime,
  onSelectTime,
}: {
  selectedDate: string;
  slots: string[];
  selectedTime: string | undefined;
  onSelectTime: (time: string) => void;
}) {
  return (
    <div className="border border-border bg-white p-6 shadow-sm sm:p-8">
      <h3 className="font-heading text-2xl font-medium tracking-tight text-foreground lg:text-3xl">
        {format(parseISODate(selectedDate), "EEEE, MMMM d")}
      </h3>

      {slots.length === 0 ? (
        <p className="mt-6 text-pretty text-lg text-muted-foreground">
          No open times left on this day — try another date.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3">
          {slots.map((slot) => {
            const isSelected = slot === selectedTime;
            return (
              <Button
                key={slot}
                type="button"
                size="lg"
                variant={isSelected ? "default" : "outline"}
                onClick={() => onSelectTime(slot)}
                aria-pressed={isSelected}
                className={cn(
                  "h-12 rounded-none text-base tabular-nums",
                  !isSelected && "shadow-xs",
                )}
              >
                {formatSlot12(slot)}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Step 1 — pick a time. A monthly calendar whose available days (computed by
 * `useAvailableSlots` from the coach's schedule, date overrides, existing
 * bookings and booking buffer) are selectable; unavailable days are disabled.
 * Selecting a date shifts to a two-column layout with the day's time slots on
 * the right (stacked below on mobile). Only one slot is selectable at a time.
 */
export function BookingCalendar({
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  bare = false,
}: BookingCalendarProps) {
  const Shell = ({ children }: { children: ReactNode }) =>
    bare ? (
      <>{children}</>
    ) : (
      <div className="mx-auto max-w-page px-6 lg:px-8">{children}</div>
    );

  const monthStart = format(startOfMonth(month), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(month), "yyyy-MM-dd");

  const { data, isLoading } = useDataProvider().useAvailableSlots({
    monthStart,
    monthEnd,
    selectedDate,
  });

  const availableSet = useMemo(
    () => new Set(data.availableDates),
    [data.availableDates],
  );

  if (isLoading) {
    return (
      <Shell>
        <CalendarSkeleton />
      </Shell>
    );
  }

  // SPEC-GAP: the public `useAvailableSlots` hook only exposes available dates
  // for the visible month, so "no availability configured" and "this month is
  // fully booked" are indistinguishable here. We show the informational message
  // only in the first-time (no date selected) state when the visible month has
  // zero open days; the visitor can still page to another month.
  const noAvailability = !selectedDate && data.availableDates.length === 0;

  const calendar = (
    <div className="border border-border bg-white p-4 shadow-sm sm:p-6">
      <Calendar
        mode="single"
        month={month}
        onMonthChange={onMonthChange}
        selected={selectedDate ? parseISODate(selectedDate) : undefined}
        onSelect={(date) => {
          if (date) onSelectDate(format(date, "yyyy-MM-dd"));
        }}
        disabled={(date) => !availableSet.has(format(date, "yyyy-MM-dd"))}
        showOutsideDays={false}
        className="mx-auto w-full text-base [--cell-size:2.75rem] sm:[--cell-size:3.25rem]"
      />
      <Legend />
    </div>
  );

  if (!selectedDate) {
    return (
      <Shell>
        <div className={cn(!bare && "mx-auto max-w-xl")}>{calendar}</div>
        {noAvailability ? (
          <p className="mt-6 text-center text-pretty text-muted-foreground">
            Booking isn't available right now — check back soon, or{" "}
            <Link
              to="/contact"
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              send a message through the contact page
            </Link>
            .
          </p>
        ) : (
          <p className="mt-6 text-center text-muted-foreground">
            Select a date to see available times.
          </p>
        )}
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div>{calendar}</div>
        <TimeSlots
          selectedDate={selectedDate}
          slots={data.slotsForDate}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />
      </div>
    </Shell>
  );
}
