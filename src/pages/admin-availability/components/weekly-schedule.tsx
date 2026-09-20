import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { DAY_LABELS, type EditableDay } from "../lib";

interface WeeklyScheduleProps {
  days: EditableDay[];
  onToggle: (dayOfWeek: number, isAvailable: boolean) => void;
  onTimeChange: (
    dayOfWeek: number,
    field: "start_time" | "end_time",
    value: string,
  ) => void;
}

/**
 * Seven day rows (Monday → Sunday). Each row is a day label, an on/off switch,
 * and start/end time inputs. When a day is off, its time inputs are dimmed and
 * non-interactive — availability for that weekday is simply not set.
 */
export function WeeklySchedule({
  days,
  onToggle,
  onTimeChange,
}: WeeklyScheduleProps) {
  return (
    <div className="rounded-lg border-solid border-border">
      {days.map((day, index) => (
        <div
          key={day.day_of_week}
          className={cn(
            "flex items-center gap-4 px-4 py-3",
            index > 0 && "border-t-hairline",
          )}
        >
          <span className="w-24 shrink-0 text-sm font-medium text-foreground">
            {DAY_LABELS[day.day_of_week]}
          </span>

          <Switch
            checked={day.is_available}
            onCheckedChange={(checked) => onToggle(day.day_of_week, checked)}
            aria-label={`Toggle availability for ${DAY_LABELS[day.day_of_week]}`}
          />

          <div
            className={cn(
              "flex flex-1 items-center gap-2",
              !day.is_available && "pointer-events-none opacity-50",
            )}
            aria-hidden={!day.is_available}
          >
            <Input
              value={day.start_time}
              onChange={(e) =>
                onTimeChange(day.day_of_week, "start_time", e.target.value)
              }
              placeholder="9:00 AM"
              className="max-w-32 tabular-nums"
              disabled={!day.is_available}
              aria-label={`Start time for ${DAY_LABELS[day.day_of_week]}`}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              value={day.end_time}
              onChange={(e) =>
                onTimeChange(day.day_of_week, "end_time", e.target.value)
              }
              placeholder="5:00 PM"
              className="max-w-32 tabular-nums"
              disabled={!day.is_available}
              aria-label={`End time for ${DAY_LABELS[day.day_of_week]}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
