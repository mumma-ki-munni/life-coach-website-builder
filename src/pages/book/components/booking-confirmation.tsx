import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSlot12, parseISODate } from "../lib";
import type { ConfirmedBooking } from "./goals-form";

/**
 * Confirmation screen — replaces the calendar + form in place on a successful
 * booking (no navigation). A large calendar-check icon, the confirmed date and
 * time in bold, a warm personal note addressed by first name, and a quiet
 * "Back to home" link. No "add to calendar", no email promise, no "book
 * another" — all explicit v1 cuts.
 */
export function BookingConfirmation({ booking }: { booking: ConfirmedBooking }) {
  const firstName = booking.clientName.trim().split(/\s+/)[0] || "there";
  const when = `${format(
    parseISODate(booking.bookingDate),
    "EEEE, MMMM d, yyyy",
  )} at ${formatSlot12(booking.bookingTime)}`;

  return (
    <div className="mx-auto max-w-page px-6 lg:px-8">
      <div className="mx-auto max-w-2xl border border-border p-8 text-center lg:p-12">
        <CalendarCheck
          className="mx-auto size-12 text-foreground"
          aria-hidden="true"
        />

        <p className="mt-8 text-pretty text-lg text-foreground">
          Your free intake call is scheduled for:
        </p>
        <p className="mt-2 text-balance font-heading text-2xl font-semibold tracking-tight text-foreground">
          {when}
        </p>

        <div className="mx-auto mt-8 max-w-prose space-y-4 text-pretty text-foreground">
          <p>
            I'm looking forward to our conversation, {firstName}. I'll come
            prepared to listen carefully and give you an honest, useful read on
            where you are and what might help.
          </p>
          <p>
            If you need to cancel or have any questions before our call, reach
            out through the{" "}
            <Link
              to="/contact"
              className="underline underline-offset-4 hover:no-underline"
            >
              contact page
            </Link>
            .
          </p>
        </div>

        <div className="mt-10">
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
