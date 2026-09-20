import { useEffect, useRef, useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminPage } from "@/components/admin-page";
import { useDataProvider, type AvailabilityRow } from "@/lib/data-provider";
import { WeeklySchedule } from "./components/weekly-schedule";
import { DateOverrides } from "./components/date-overrides";
import {
  BUFFER_OPTIONS,
  DAY_LABELS,
  buildEditableDays,
  to24Hour,
  type EditableDay,
} from "./lib";

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </h2>
  );
}

/**
 * Availability (`/admin/availability`) — the coach sets a weekly schedule, a
 * booking buffer, and specific blocked dates. This drives which days and times
 * appear as selectable on the public `/book` calendar.
 */
export default function AdminAvailability() {
  const { useAvailability, useProfile, useSaveAvailability } =
    useDataProvider();
  const { data: availability, isLoading: availLoading } = useAvailability();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { mutate: saveAvailability, isPending } = useSaveAvailability();

  const [days, setDays] = useState<EditableDay[]>([]);
  const [buffer, setBuffer] = useState("24");
  const initialized = useRef(false);

  // Seed the editable state once the schedule + profile have loaded. Guarded so
  // later refetches (e.g. after a save) don't clobber in-progress edits.
  useEffect(() => {
    if (initialized.current) return;
    if (availLoading || profileLoading) return;
    setDays(buildEditableDays(availability));
    setBuffer(String(profile.booking_buffer_hours));
    initialized.current = true;
  }, [availLoading, profileLoading, availability, profile]);

  const toggleDay = (dayOfWeek: number, isAvailable: boolean) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.day_of_week !== dayOfWeek) return d;
        // Seed sensible defaults the first time a day is turned on so the coach
        // isn't hit with a "enter valid times" error before typing anything.
        const needsDefaults = isAvailable && (!d.start_time || !d.end_time);
        return {
          ...d,
          is_available: isAvailable,
          start_time: needsDefaults ? "9:00 AM" : d.start_time,
          end_time: needsDefaults ? "5:00 PM" : d.end_time,
        };
      }),
    );
  };

  const changeTime = (
    dayOfWeek: number,
    field: "start_time" | "end_time",
    value: string,
  ) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day_of_week === dayOfWeek ? { ...d, [field]: value } : d,
      ),
    );
  };

  const handleSave = () => {
    const rows: AvailabilityRow[] = [];
    for (const day of days) {
      if (!day.is_available) {
        rows.push({
          day_of_week: day.day_of_week,
          is_available: false,
          start_time: null,
          end_time: null,
        });
        continue;
      }
      const start = to24Hour(day.start_time);
      const end = to24Hour(day.end_time);
      if (!start || !end) {
        toast.error(
          `Enter valid start and end times for ${DAY_LABELS[day.day_of_week]} (e.g. 9:00 AM).`,
        );
        return;
      }
      if (start >= end) {
        toast.error(
          `${DAY_LABELS[day.day_of_week]} end time must be after the start time.`,
        );
        return;
      }
      rows.push({
        day_of_week: day.day_of_week,
        is_available: true,
        start_time: start,
        end_time: end,
      });
    }
    saveAvailability({ rows, bufferHours: Number(buffer) });
  };

  return (
    <AdminPage
      title="Availability"
      description="Set when you're available for intake calls. This controls which days visitors can book."
    >
      <section className="space-y-4">
        <SectionHeading>Weekly schedule</SectionHeading>
        <WeeklySchedule
          days={days}
          onToggle={toggleDay}
          onTimeChange={changeTime}
        />
      </section>

      <section className="mt-8 space-y-2">
        <SectionHeading>Booking buffer</SectionHeading>
        <p className="text-sm text-muted-foreground">
          Minimum notice before a booking.
        </p>
        <Select value={buffer} onValueChange={setBuffer}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BUFFER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="mt-8 space-y-3">
        <SectionHeading>Date overrides</SectionHeading>
        <p className="text-sm text-muted-foreground">
          Block specific dates (holidays, vacation).
        </p>
        <DateOverrides />
      </section>

      <div className="mt-10">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <>
              <IconLoader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save availability"
          )}
        </Button>
      </div>
    </AdminPage>
  );
}
