import { useState } from "react";
import { format } from "date-fns";
import { IconCalendarPlus, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDataProvider } from "@/lib/data-provider";
import { formatOverrideDate } from "../lib";

/**
 * Date overrides — specific days the coach blocks (holidays, vacation) on top of
 * the weekly schedule. Add via a popover calendar + optional reason; remove
 * immediately with the row's [X] button (no confirmation, per spec).
 */
export function DateOverrides() {
  const { useDateOverrides, useCreateDateOverride, useDeleteDateOverride } =
    useDataProvider();
  const { data: overrides } = useDateOverrides();
  const { mutate: createOverride } = useCreateDateOverride();
  const { mutate: deleteOverride } = useDeleteDateOverride();

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");

  const handleBlockDate = () => {
    if (!selectedDate) return;
    createOverride({
      override_date: format(selectedDate, "yyyy-MM-dd"),
      reason: reason.trim() || null,
    });
    setSelectedDate(undefined);
    setReason("");
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setSelectedDate(undefined);
            setReason("");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline">
            <IconCalendarPlus className="size-4" />
            Add a date
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            autoFocus
          />
          <div className="space-y-3 border-t-hairline p-3">
            <div className="space-y-1.5">
              <Label htmlFor="override-reason">Reason (optional)</Label>
              <Input
                id="override-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Holiday"
              />
            </div>
            <Button
              className="w-full"
              disabled={!selectedDate}
              onClick={handleBlockDate}
            >
              Block this date
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {overrides.length === 0 ? (
        <p className="text-sm text-muted-foreground">No dates blocked.</p>
      ) : (
        <ul className="space-y-2">
          {overrides.map((override) => (
            <li
              key={override.id}
              className="flex items-center gap-3 rounded-md border-solid border-border px-3 py-2"
            >
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0"
                onClick={() => deleteOverride(override.id)}
                aria-label={`Remove ${formatOverrideDate(override.override_date)}`}
              >
                <IconX className="size-4" />
              </Button>
              <span className="text-sm text-foreground">
                {formatOverrideDate(override.override_date)}
                {override.reason ? (
                  <span className="text-muted-foreground italic">
                    {" · "}
                    {override.reason}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
