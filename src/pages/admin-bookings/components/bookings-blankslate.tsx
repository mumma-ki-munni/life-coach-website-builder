import { Link } from "react-router-dom";
import { IconCalendar } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * First-time state for Intake Requests: static skeleton bars behind a floating
 * card that explains what to do next. The one path to bookings is configuring
 * availability, so the CTA points there.
 */
export function BookingsBlankslate({
  availabilityHref,
}: {
  availabilityHref: string;
}) {
  return (
    <div className="relative">
      {/* Decorative skeleton bars — non-interactive, hidden from AT. */}
      <div
        aria-hidden="true"
        className="pointer-events-none space-y-3 opacity-60"
      >
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10">
        <Card className="pointer-events-auto flex max-w-sm flex-col items-center gap-4 !shadow-lg px-8 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <IconCalendar className="size-6 text-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              No intake calls yet
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              Share your booking link to get your first call booked.
            </p>
          </div>
          <Button asChild className="rounded-md bg-foreground text-background hover:bg-foreground/90">
            <Link to={availabilityHref}>Set your availability →</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
