import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/base/badge";
import { useDataProvider, type Booking } from "@/lib/data-provider";
import { formatDateLong, formatTime12 } from "../lib";

const statusBadge: Record<
  Booking["status"],
  { color: "green" | "gray" | "red"; label: string }
> = {
  confirmed: { color: "green", label: "confirmed" },
  completed: { color: "gray", label: "completed" },
  cancelled: { color: "red", label: "cancelled" },
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function BookingDetailPanel({
  booking,
  open,
  onOpenChange,
}: {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { usePrograms, useUpdateBookingStatus } = useDataProvider();
  const { data: programs } = usePrograms();
  const { mutate, isPending } = useUpdateBookingStatus();

  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [note, setNote] = useState("");

  const close = (next: boolean) => {
    if (!next) {
      setConfirmingCancel(false);
      setNote("");
    }
    onOpenChange(next);
  };

  const programName = booking?.program_interest_id
    ? programs.find((p) => p.id === booking.program_interest_id)?.name
    : undefined;

  const markCompleted = () => {
    if (!booking) return;
    mutate({ id: booking.id, status: "completed" });
    close(false);
  };

  const confirmCancel = () => {
    if (!booking) return;
    mutate({
      id: booking.id,
      status: "cancelled",
      cancellation_note: note.trim() || null,
    });
    close(false);
  };

  const badge = booking ? statusBadge[booking.status] : null;

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {booking && badge && (
          <>
            <SheetHeader className="space-y-1 text-left">
              <SheetTitle className="text-lg font-semibold">
                {booking.client_name}
              </SheetTitle>
              <a
                href={`mailto:${booking.client_email}`}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                {booking.client_email}
              </a>
              {booking.client_phone && (
                <p className="text-sm text-muted-foreground">
                  {booking.client_phone}
                </p>
              )}
            </SheetHeader>

            <Separator className="my-6" />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {formatDateLong(booking.booking_date)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatTime12(booking.booking_time)}
              </p>
              <Badge color={badge.color}>{badge.label}</Badge>
            </div>

            <Separator className="my-6" />

            <div className="space-y-5">
              <Field label="Focus area" value={booking.focus_area} />
              {programName && (
                <Field label="Program interest" value={programName} />
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Their goals
                </p>
                <blockquote className="border-l-2 border-border bg-muted/50 px-4 py-3 text-sm text-foreground text-pretty">
                  {booking.goals}
                </blockquote>
              </div>
            </div>

            {booking.status === "confirmed" && (
              <>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-md"
                    onClick={markCompleted}
                    disabled={isPending}
                  >
                    Mark as completed
                  </Button>

                  {confirmingCancel ? (
                    <div className="space-y-2">
                      <label
                        htmlFor="cancellation-note"
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        Cancellation note (optional)
                      </label>
                      <Textarea
                        id="cancellation-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note for your records…"
                        rows={3}
                      />
                      <Button
                        variant="outline"
                        className="w-full rounded-md text-destructive hover:text-destructive"
                        onClick={confirmCancel}
                        disabled={isPending}
                      >
                        Confirm cancellation
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full rounded-md hover:text-destructive"
                      onClick={() => setConfirmingCancel(true)}
                      disabled={isPending}
                    >
                      Cancel booking
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
