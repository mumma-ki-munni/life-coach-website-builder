import { useRef, useState } from "react";
import { SiteHeader } from "@/pages/landing/components/site-header";
import { SiteFooter } from "@/pages/landing/components/site-footer";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";
import { ValuePanel } from "./components/value-panel";
import { BookingCalendar } from "./components/booking-calendar";
import { GoalsForm, type ConfirmedBooking } from "./components/goals-form";
import { BookingConfirmation } from "./components/booking-confirmation";

function StepLabel({ children }: { children: string }) {
  return (
    <div className="mx-auto max-w-page px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          {children}
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
    </div>
  );
}

/**
 * Book (`/book`) — the intake booking flow. A value pitch, then Step 1 (monthly
 * calendar → time slots) and Step 2 (guest goals form) revealed progressively,
 * ending in an on-screen confirmation. Public, guest booking only. All data
 * flows through the DataProvider (`useAvailableSlots`, `useActivePrograms`,
 * `useCreateBooking`) — the "Book" nav link gets its active treatment from the
 * shared `SiteHeader`.
 */
export default function Book() {
  const [month, setMonth] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  const goalsRef = useRef<HTMLDivElement>(null);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    // A new date invalidates the previously chosen time.
    setSelectedTime(undefined);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    // Selecting a slot reveals Step 2 — scroll it into view once it renders.
    requestAnimationFrame(() => {
      goalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="theme-blush flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {confirmed ? (
          <div className="space-y-10 py-16 lg:py-20">
            <SegmentedText
              as="h1"
              className="block text-balance text-center font-heading text-4xl font-medium leading-[1.02] tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              You're booked.
            </SegmentedText>
            <BookingConfirmation booking={confirmed} />
          </div>
        ) : (
          <div className="space-y-12 py-16 lg:space-y-16 lg:py-20">
            <SegmentedText
              as="h1"
              className="block text-balance text-center font-heading text-4xl font-medium leading-[1.02] tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Book your free intake call
            </SegmentedText>

            {!selectedDate ? (
              // First-time two-up: the intake pitch on the left, the calendar on
              // the right (Calendly-style). Collapses to stacked below `lg`.
              <div className="mx-auto max-w-page px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
                  <Reveal className="min-w-0">
                    <ValuePanel compact={false} bare />
                  </Reveal>
                  <Reveal order={1} className="min-w-0 space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Step 1 of 2: Pick a time
                      </span>
                      <span
                        className="h-px flex-1 bg-border"
                        aria-hidden="true"
                      />
                    </div>
                    <BookingCalendar
                      bare
                      month={month}
                      onMonthChange={setMonth}
                      selectedDate={selectedDate}
                      onSelectDate={handleSelectDate}
                      selectedTime={selectedTime}
                      onSelectTime={handleSelectTime}
                    />
                  </Reveal>
                </div>
              </div>
            ) : (
              <>
                <Reveal>
                  <ValuePanel compact />
                </Reveal>

                <section className="space-y-8">
                  <StepLabel>Step 1 of 2: Pick a time</StepLabel>
                  <BookingCalendar
                    month={month}
                    onMonthChange={setMonth}
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    selectedTime={selectedTime}
                    onSelectTime={handleSelectTime}
                  />
                </section>

                {selectedTime && (
                  <section ref={goalsRef} className="space-y-8 scroll-mt-24">
                    <StepLabel>Step 2 of 2: Tell me about your goals</StepLabel>
                    <GoalsForm
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onConfirmed={setConfirmed}
                    />
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
