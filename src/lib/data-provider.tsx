import { createContext, useContext, type ReactNode } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/auth-provider";
import * as seed from "@/data/seed";
import type {
  AvailabilityRow,
  Booking,
  BookingStatus,
  ContactMessage,
  DateOverride,
  MessageStatus,
  Profile,
  Program,
} from "@/data/seed";

export type {
  AvailabilityRow,
  Booking,
  ContactMessage,
  DateOverride,
  Profile,
  Program,
};

// ─────────────────────────────────────────────────────────────────────────────
// Input, filter and return types
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateProgramInput {
  name: string;
  who_its_for: string;
  description: string[];
  duration_label: string;
  icon?: string;
}

export interface UpdateProgramInput {
  id: string;
  name?: string;
  who_its_for?: string;
  description?: string[];
  duration_label?: string;
  is_active?: boolean;
}

export interface SaveAvailabilityInput {
  rows: AvailabilityRow[];
  bufferHours: number;
}

export interface CreateDateOverrideInput {
  override_date: string;
  reason?: string | null;
}

export interface SlotFilters {
  monthStart: string;
  monthEnd: string;
  selectedDate?: string;
}

export interface AvailableSlotsResult {
  availableDates: string[];
  slotsForDate: string[];
}

export interface CreateBookingInput {
  client_name: string;
  client_email: string;
  client_phone?: string | null;
  focus_area: string;
  goals: string;
  program_interest_id?: string | null;
  booking_date: string;
  booking_time: string;
}

export interface BookingFilters {
  tab: "upcoming" | "past" | "cancelled";
}

export interface UpdateBookingStatusInput {
  id: string;
  status: "completed" | "cancelled";
  cancellation_note?: string | null;
}

export interface CreateContactMessageInput {
  name: string;
  email: string;
  subject: string;
  inquiry_type: ContactMessage["inquiry_type"];
  message: string;
}

export interface MessageFilters {
  tab: "all" | "new" | "read";
}

export interface UpdateMessageStatusInput {
  id: string;
  status: "read" | "archived";
}

interface ReadResult<T> {
  data: T;
  isLoading: boolean;
}

interface MutationResult<TInput> {
  mutate: (input: TInput) => void;
  isPending: boolean;
}

export interface AppDataProvider {
  // Programs
  useActivePrograms(): ReadResult<Program[]>;
  usePrograms(): ReadResult<Program[]>;
  useCreateProgram(): MutationResult<CreateProgramInput>;
  useUpdateProgram(): MutationResult<UpdateProgramInput>;
  useReorderPrograms(): MutationResult<Program[]>;

  // Availability
  useAvailability(): ReadResult<AvailabilityRow[]>;
  useSaveAvailability(): MutationResult<SaveAvailabilityInput>;
  useDateOverrides(): ReadResult<DateOverride[]>;
  useCreateDateOverride(): MutationResult<CreateDateOverrideInput>;
  useDeleteDateOverride(): MutationResult<string>;
  useProfile(): ReadResult<Profile>;

  // Booking (public)
  useAvailableSlots(filters: SlotFilters): ReadResult<AvailableSlotsResult>;
  useCreateBooking(): MutationResult<CreateBookingInput>;

  // Admin bookings
  useBookings(filters: BookingFilters): ReadResult<Booking[]>;
  useUpdateBookingStatus(): MutationResult<UpdateBookingStatusInput>;

  // Contact (public)
  useCreateContactMessage(): MutationResult<CreateContactMessageInput>;

  // Admin messages
  useMessages(filters: MessageFilters): ReadResult<ContactMessage[]>;
  useUpdateMessageStatus(): MutationResult<UpdateMessageStatusInput>;
}

const DataProviderContext = createContext<AppDataProvider | null>(null);

export function useDataProvider(): AppDataProvider {
  const ctx = useContext(DataProviderContext);
  if (!ctx) throw new Error("useDataProvider must be inside a DataProvider");
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

// The single-owner site's coach id is exposed via the `site_owner` public view.
// Anon can select it without holding EXECUTE on any SECURITY DEFINER function.
async function resolveOwnerCoachId(): Promise<string | null> {
  const { data, error } = await supabase
    .from("site_owner")
    .select("coach_id")
    .maybeSingle();
  if (error) throw error;
  return (data?.coach_id as string | null) ?? null;
}

// `description` is a single text column in Postgres (one bullet per line) but a
// string[] everywhere in the app. Convert at the Supabase boundary.
const splitDescription = (text: string | null | undefined): string[] =>
  (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const joinDescription = (items: string[]): string => items.join("\n");

interface ProgramRow {
  id: string;
  name: string;
  icon: string;
  who_its_for: string;
  description: string;
  duration_label: string;
  is_active?: boolean;
  display_order: number;
}

const mapProgramRow = (row: ProgramRow): Program => ({
  id: row.id,
  name: row.name,
  icon: row.icon,
  who_its_for: row.who_its_for,
  description: splitDescription(row.description),
  duration_label: row.duration_label,
  is_active: row.is_active ?? true,
  display_order: row.display_order,
});

const parseISODate = (iso: string): Date => new Date(`${iso}T00:00:00`);

/**
 * Client-side availability aggregation shared by both providers. For each day in
 * the month range: keep it if (a) its weekday is available in the schedule,
 * (b) it isn't a blocked override date, and (c) it still has at least one open
 * slot after the booking buffer. For a selected date, expand hourly slots
 * between start/end minus already-booked times and buffer-excluded times.
 */
function computeAvailableSlots(
  schedule: Pick<
    AvailabilityRow,
    "day_of_week" | "start_time" | "end_time" | "is_available"
  >[],
  overrideDates: string[],
  bookings: { booking_date: string; booking_time: string }[],
  bufferHours: number,
  filters: SlotFilters,
): AvailableSlotsResult {
  const overrideSet = new Set(overrideDates);
  const bookedByDate = new Map<string, Set<string>>();
  for (const b of bookings) {
    if (!bookedByDate.has(b.booking_date)) {
      bookedByDate.set(b.booking_date, new Set());
    }
    bookedByDate.get(b.booking_date)!.add(b.booking_time);
  }

  const minBookable = new Date(Date.now() + bufferHours * 3600 * 1000);

  const slotsFor = (iso: string): string[] => {
    const dow = parseISODate(iso).getDay();
    const row = schedule.find((r) => r.day_of_week === dow);
    if (
      !row ||
      !row.is_available ||
      !row.start_time ||
      !row.end_time ||
      overrideSet.has(iso)
    ) {
      return [];
    }
    const booked = bookedByDate.get(iso) ?? new Set<string>();
    const startHour = parseInt(row.start_time.slice(0, 2), 10);
    const endHour = parseInt(row.end_time.slice(0, 2), 10);
    const slots: string[] = [];
    for (let h = startHour; h < endHour; h++) {
      const time = `${String(h).padStart(2, "0")}:00`;
      if (booked.has(time)) continue;
      if (new Date(`${iso}T${time}:00`) < minBookable) continue;
      slots.push(time);
    }
    return slots;
  };

  const availableDates: string[] = [];
  const end = parseISODate(filters.monthEnd);
  for (
    let d = parseISODate(filters.monthStart);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const iso = format(d, "yyyy-MM-dd");
    if (slotsFor(iso).length > 0) availableDates.push(iso);
  }

  const slotsForDate = filters.selectedDate
    ? slotsFor(filters.selectedDate)
    : [];

  return { availableDates, slotsForDate };
}

// ─────────────────────────────────────────────────────────────────────────────
// SeedDataProvider — reads from src/data/seed.ts, filtered in-memory
// ─────────────────────────────────────────────────────────────────────────────

// The seed fixtures are anchored to April 2025. Admin booking tabs compare
// against this reference "today" (not the wall clock) so the demo shows the
// lived-in state the storyboard describes: three confirmed upcoming calls.
const SEED_TODAY = "2025-04-20";

const demoWriteToast = () => toast("Sign in to save changes");

export function SeedDataProvider({ children }: { children: ReactNode }) {
  const provider: AppDataProvider = {
    useActivePrograms: () => ({
      data: seed.programs
        .filter((p) => p.is_active)
        .sort((a, b) => a.display_order - b.display_order),
      isLoading: false,
    }),

    usePrograms: () => ({
      data: [...seed.programs].sort(
        (a, b) => a.display_order - b.display_order,
      ),
      isLoading: false,
    }),

    useCreateProgram: () => ({ mutate: demoWriteToast, isPending: false }),
    useUpdateProgram: () => ({ mutate: demoWriteToast, isPending: false }),
    useReorderPrograms: () => ({ mutate: demoWriteToast, isPending: false }),

    useAvailability: () => ({
      data: [...seed.availability].sort(
        (a, b) => a.day_of_week - b.day_of_week,
      ),
      isLoading: false,
    }),

    useSaveAvailability: () => ({ mutate: demoWriteToast, isPending: false }),

    useDateOverrides: () => ({
      data: [...seed.dateOverrides].sort((a, b) =>
        a.override_date.localeCompare(b.override_date),
      ),
      isLoading: false,
    }),

    useCreateDateOverride: () => ({
      mutate: demoWriteToast,
      isPending: false,
    }),
    useDeleteDateOverride: () => ({
      mutate: demoWriteToast,
      isPending: false,
    }),

    useProfile: () => ({ data: seed.profile, isLoading: false }),

    useAvailableSlots: (filters) => ({
      data: computeAvailableSlots(
        seed.availability,
        seed.dateOverrides.map((o) => o.override_date),
        seed.bookings.filter((b) => b.status === "confirmed"),
        seed.profile.booking_buffer_hours,
        filters,
      ),
      isLoading: false,
    }),

    useCreateBooking: () => ({ mutate: demoWriteToast, isPending: false }),

    useBookings: (filters) => {
      const filtered = seed.bookings.filter((b) => {
        if (filters.tab === "upcoming")
          return b.status === "confirmed" && b.booking_date >= SEED_TODAY;
        if (filters.tab === "past") return b.status === "completed";
        if (filters.tab === "cancelled") return b.status === "cancelled";
        return true;
      });
      const sorted = [...filtered].sort((a, b) =>
        filters.tab === "upcoming"
          ? a.booking_date.localeCompare(b.booking_date)
          : b.booking_date.localeCompare(a.booking_date),
      );
      return { data: sorted, isLoading: false };
    },

    useUpdateBookingStatus: () => ({
      mutate: demoWriteToast,
      isPending: false,
    }),

    useCreateContactMessage: () => ({
      mutate: demoWriteToast,
      isPending: false,
    }),

    useMessages: (filters) => {
      const filtered = seed.contactMessages.filter((m) => {
        if (filters.tab === "all")
          return m.status === "new" || m.status === "read";
        if (filters.tab === "new") return m.status === "new";
        if (filters.tab === "read") return m.status === "read";
        return true;
      });
      const sorted = [...filtered].sort((a, b) =>
        b.created_at.localeCompare(a.created_at),
      );
      return { data: sorted, isLoading: false };
    },

    useUpdateMessageStatus: () => ({
      mutate: demoWriteToast,
      isPending: false,
    }),
  };

  return (
    <DataProviderContext.Provider value={provider}>
      {children}
    </DataProviderContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SupabaseDataProvider — real React Query hooks over Supabase
// ─────────────────────────────────────────────────────────────────────────────

const PROGRAM_COLUMNS =
  "id, name, icon, who_its_for, description, duration_label, is_active, display_order";
const BOOKING_COLUMNS =
  "id, client_name, client_email, client_phone, focus_area, goals, program_interest_id, booking_date, booking_time, status, cancellation_note, created_at";
const MESSAGE_COLUMNS =
  "id, name, email, subject, inquiry_type, message, status, created_at";

export function SupabaseDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const provider: AppDataProvider = {
    // ── Programs ───────────────────────────────────────────────────────────
    useActivePrograms: () => {
      const { data, isLoading } = useQuery({
        queryKey: ["programs", "active"],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("programs")
            .select(
              "id, name, icon, who_its_for, description, duration_label, display_order",
            )
            .eq("is_active", true)
            .order("display_order", { ascending: true });
          if (error) throw error;
          return (data ?? []).map((row) =>
            mapProgramRow(row as unknown as ProgramRow),
          );
        },
      });
      return { data: data ?? [], isLoading };
    },

    usePrograms: () => {
      const { data, isLoading } = useQuery({
        queryKey: ["programs", userId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("programs")
            .select(PROGRAM_COLUMNS)
            .eq("coach_id", userId!)
            .order("display_order", { ascending: true });
          if (error) throw error;
          return (data ?? []).map((row) =>
            mapProgramRow(row as unknown as ProgramRow),
          );
        },
        enabled: !!userId,
      });
      return { data: data ?? [], isLoading };
    },

    useCreateProgram: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreateProgramInput) => {
          const { data: existing } = await supabase
            .from("programs")
            .select("id")
            .eq("coach_id", userId!);
          const { data, error } = await supabase
            .from("programs")
            .insert({
              coach_id: userId!,
              name: input.name,
              who_its_for: input.who_its_for,
              description: joinDescription(input.description),
              duration_label: input.duration_label,
              icon: input.icon ?? "Briefcase",
              is_active: true,
              display_order: (existing?.length ?? 0) + 1,
            })
            .select(PROGRAM_COLUMNS)
            .single();
          if (error) throw error;
          return mapProgramRow(data as unknown as ProgramRow);
        },
        onMutate: async (input) => {
          await queryClient.cancelQueries({ queryKey: ["programs", userId] });
          const previous = queryClient.getQueryData<Program[]>([
            "programs",
            userId,
          ]);
          const optimistic: Program = {
            id: `temp-${previous?.length ?? 0}`,
            name: input.name,
            icon: input.icon ?? "Briefcase",
            who_its_for: input.who_its_for,
            description: input.description,
            duration_label: input.duration_label,
            is_active: true,
            display_order: (previous?.length ?? 0) + 1,
          };
          queryClient.setQueryData<Program[]>(
            ["programs", userId],
            [...(previous ?? []), optimistic],
          );
          return { previous };
        },
        onError: (_err, _input, context) => {
          queryClient.setQueryData(["programs", userId], context?.previous);
          toast.error("Couldn't add the program — try again.");
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["programs", userId] });
          queryClient.invalidateQueries({ queryKey: ["programs", "active"] });
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useUpdateProgram: () => {
      const mutation = useMutation({
        mutationFn: async (input: UpdateProgramInput) => {
          const patch: Record<string, unknown> = {};
          if (input.name !== undefined) patch.name = input.name;
          if (input.who_its_for !== undefined)
            patch.who_its_for = input.who_its_for;
          if (input.description !== undefined)
            patch.description = joinDescription(input.description);
          if (input.duration_label !== undefined)
            patch.duration_label = input.duration_label;
          if (input.is_active !== undefined) patch.is_active = input.is_active;
          const { data, error } = await supabase
            .from("programs")
            .update(patch)
            .eq("id", input.id)
            .eq("coach_id", userId!)
            .select(PROGRAM_COLUMNS)
            .single();
          if (error) throw error;
          return mapProgramRow(data as unknown as ProgramRow);
        },
        onMutate: async (input) => {
          await queryClient.cancelQueries({ queryKey: ["programs", userId] });
          const previous = queryClient.getQueryData<Program[]>([
            "programs",
            userId,
          ]);
          queryClient.setQueryData<Program[]>(
            ["programs", userId],
            (old) =>
              (old ?? []).map((p) =>
                p.id === input.id
                  ? {
                      ...p,
                      ...("name" in input && input.name !== undefined
                        ? { name: input.name }
                        : {}),
                      ...(input.who_its_for !== undefined
                        ? { who_its_for: input.who_its_for }
                        : {}),
                      ...(input.description !== undefined
                        ? { description: input.description }
                        : {}),
                      ...(input.duration_label !== undefined
                        ? { duration_label: input.duration_label }
                        : {}),
                      ...(input.is_active !== undefined
                        ? { is_active: input.is_active }
                        : {}),
                    }
                  : p,
              ),
          );
          return { previous };
        },
        onError: (_err, _input, context) => {
          queryClient.setQueryData(["programs", userId], context?.previous);
          toast.error("Couldn't save the program — try again.");
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["programs", userId] });
          queryClient.invalidateQueries({ queryKey: ["programs", "active"] });
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useReorderPrograms: () => {
      const mutation = useMutation({
        mutationFn: async (ordered: Program[]) => {
          for (const [index, program] of ordered.entries()) {
            const { error } = await supabase
              .from("programs")
              .update({ display_order: index + 1 })
              .eq("id", program.id)
              .eq("coach_id", userId!);
            if (error) throw error;
          }
        },
        onMutate: async (ordered) => {
          await queryClient.cancelQueries({ queryKey: ["programs", userId] });
          const previous = queryClient.getQueryData<Program[]>([
            "programs",
            userId,
          ]);
          queryClient.setQueryData<Program[]>(
            ["programs", userId],
            ordered.map((p, i) => ({ ...p, display_order: i + 1 })),
          );
          return { previous };
        },
        onError: (_err, _input, context) => {
          queryClient.setQueryData(["programs", userId], context?.previous);
          toast.error("Couldn't reorder — try again.");
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["programs", userId] });
          queryClient.invalidateQueries({ queryKey: ["programs", "active"] });
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    // ── Availability ─────────────────────────────────────────────────────────
    useAvailability: () => {
      const { data, isLoading } = useQuery({
        queryKey: ["availability", userId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("availability")
            .select("id, day_of_week, start_time, end_time, is_available")
            .eq("coach_id", userId!)
            .order("day_of_week", { ascending: true });
          if (error) throw error;
          return (data ?? []) as unknown as AvailabilityRow[];
        },
        enabled: !!userId,
      });
      return { data: data ?? [], isLoading };
    },

    useSaveAvailability: () => {
      const mutation = useMutation({
        mutationFn: async (input: SaveAvailabilityInput) => {
          const { error: availError } = await supabase
            .from("availability")
            .upsert(
              input.rows.map((row) => ({
                coach_id: userId!,
                day_of_week: row.day_of_week,
                start_time: row.is_available ? row.start_time : null,
                end_time: row.is_available ? row.end_time : null,
                is_available: row.is_available,
              })),
              { onConflict: "coach_id,day_of_week" },
            );
          if (availError) throw availError;
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ booking_buffer_hours: input.bufferHours })
            .eq("id", userId!);
          if (profileError) throw profileError;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["availability", userId] });
          queryClient.invalidateQueries({ queryKey: ["profile", userId] });
          toast.success("Availability saved.");
        },
        onError: () => {
          toast.error("Couldn't save availability — try again.");
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useDateOverrides: () => {
      const { data, isLoading } = useQuery({
        queryKey: ["date_overrides", userId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("date_overrides")
            .select("id, override_date, reason")
            .eq("coach_id", userId!)
            .order("override_date", { ascending: true });
          if (error) throw error;
          return (data ?? []) as unknown as DateOverride[];
        },
        enabled: !!userId,
      });
      return { data: data ?? [], isLoading };
    },

    useCreateDateOverride: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreateDateOverrideInput) => {
          const { data, error } = await supabase
            .from("date_overrides")
            .insert({
              coach_id: userId!,
              override_date: input.override_date,
              reason: input.reason ?? null,
            })
            .select("id, override_date, reason")
            .single();
          if (error) throw error;
          return data as unknown as DateOverride;
        },
        onMutate: async (input) => {
          await queryClient.cancelQueries({
            queryKey: ["date_overrides", userId],
          });
          const previous = queryClient.getQueryData<DateOverride[]>([
            "date_overrides",
            userId,
          ]);
          const optimistic: DateOverride = {
            id: `temp-${input.override_date}`,
            override_date: input.override_date,
            reason: input.reason ?? null,
          };
          queryClient.setQueryData<DateOverride[]>(
            ["date_overrides", userId],
            [...(previous ?? []), optimistic].sort((a, b) =>
              a.override_date.localeCompare(b.override_date),
            ),
          );
          return { previous };
        },
        onError: (_err, _input, context) => {
          queryClient.setQueryData(
            ["date_overrides", userId],
            context?.previous,
          );
          toast.error("Couldn't block that date — try again.");
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["date_overrides", userId],
          });
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useDeleteDateOverride: () => {
      const mutation = useMutation({
        mutationFn: async (id: string) => {
          const { error } = await supabase
            .from("date_overrides")
            .delete()
            .eq("id", id)
            .eq("coach_id", userId!);
          if (error) throw error;
        },
        onMutate: async (id) => {
          await queryClient.cancelQueries({
            queryKey: ["date_overrides", userId],
          });
          const previous = queryClient.getQueryData<DateOverride[]>([
            "date_overrides",
            userId,
          ]);
          queryClient.setQueryData<DateOverride[]>(
            ["date_overrides", userId],
            (old) => (old ?? []).filter((o) => o.id !== id),
          );
          return { previous };
        },
        onError: (_err, _id, context) => {
          queryClient.setQueryData(
            ["date_overrides", userId],
            context?.previous,
          );
          toast.error("Couldn't remove that date — try again.");
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["date_overrides", userId],
          });
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useProfile: () => {
      const { data, isLoading } = useQuery({
        queryKey: ["profile", userId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, booking_buffer_hours")
            .eq("id", userId!)
            .single();
          if (error) throw error;
          return data as unknown as Profile;
        },
        enabled: !!userId,
      });
      return {
        data:
          data ?? {
            id: userId ?? "",
            full_name: "",
            booking_buffer_hours: 24,
          },
        isLoading,
      };
    },

    // ── Booking (public) ───────────────────────────────────────────────────
    useAvailableSlots: (filters) => {
      const { data, isLoading } = useQuery({
        queryKey: ["available_slots", filters],
        queryFn: async () => {
          // Availability + overrides are anon-readable (single-owner site).
          const { data: schedule } = await supabase
            .from("availability")
            .select("day_of_week, start_time, end_time, is_available");
          const { data: overrides } = await supabase
            .from("date_overrides")
            .select("override_date")
            .gte("override_date", filters.monthStart)
            .lte("override_date", filters.monthEnd);
          // Confirmed-only filter is enforced by the RLS policy
          // "bookings select anon confirmed" — anon has column-level SELECT
          // on (booking_date, booking_time) only, so we must NOT reference
          // the `status` column in the query (PostgREST requires SELECT
          // privilege on any filtered column).
          const { data: existing } = await supabase
            .from("bookings")
            .select("booking_date, booking_time")
            .gte("booking_date", filters.monthStart)
            .lte("booking_date", filters.monthEnd);

          // Buffer: resolve the owner via RPC, then try to read their profile.
          // Fall back to 24h if we can't (e.g. profile not anon-readable).
          let bufferHours = 24;
          const ownerId = await resolveOwnerCoachId();
          if (ownerId) {
            const { data: prof } = await supabase
              .from("profiles")
              .select("booking_buffer_hours")
              .eq("id", ownerId)
              .maybeSingle();
            if (prof?.booking_buffer_hours != null) {
              bufferHours = prof.booking_buffer_hours as number;
            }
          }

          return computeAvailableSlots(
            (schedule ?? []) as AvailabilityRow[],
            ((overrides ?? []) as { override_date: string }[]).map(
              (o) => o.override_date,
            ),
            (existing ?? []) as {
              booking_date: string;
              booking_time: string;
            }[],
            bufferHours,
            filters,
          );
        },
      });
      return {
        data: data ?? { availableDates: [], slotsForDate: [] },
        isLoading,
      };
    },

    useCreateBooking: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreateBookingInput) => {
          const ownerId = await resolveOwnerCoachId();
          if (!ownerId) {
            throw new Error(
              "This site isn't accepting bookings yet — no coach profile is set up.",
            );
          }
          // Anon can insert but not read bookings back — omit `.select()` so
          // RLS on the read-back doesn't reject an otherwise-successful write.
          const { error } = await supabase.from("bookings").insert({
            coach_id: ownerId,
            client_name: input.client_name,
            client_email: input.client_email,
            client_phone: input.client_phone ?? null,
            focus_area: input.focus_area,
            goals: input.goals,
            program_interest_id: input.program_interest_id ?? null,
            booking_date: input.booking_date,
            booking_time: input.booking_time,
            status: "confirmed",
          });
          if (error) throw error;
          return null;
        },
        onSuccess: () => {
          // Affects the admin cache only — the visitor sees a confirmation screen.
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          queryClient.invalidateQueries({ queryKey: ["available_slots"] });
        },
        onError: () => {
          toast.error("Couldn't confirm your booking — please try again.");
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    // ── Admin bookings ───────────────────────────────────────────────────────
    useBookings: (filters) => {
      const { data, isLoading } = useQuery({
        queryKey: ["bookings", userId, filters.tab],
        queryFn: async () => {
          const today = format(new Date(), "yyyy-MM-dd");
          let query = supabase
            .from("bookings")
            .select(BOOKING_COLUMNS)
            .eq("coach_id", userId!);

          if (filters.tab === "upcoming") {
            query = query
              .eq("status", "confirmed")
              .gte("booking_date", today)
              .order("booking_date", { ascending: true });
          } else if (filters.tab === "past") {
            query = query
              .eq("status", "completed")
              .order("booking_date", { ascending: false });
          } else {
            query = query
              .eq("status", "cancelled")
              .order("booking_date", { ascending: false });
          }

          const { data, error } = await query;
          if (error) throw error;
          return (data ?? []) as unknown as Booking[];
        },
        enabled: !!userId,
      });
      return { data: data ?? [], isLoading };
    },

    useUpdateBookingStatus: () => {
      const mutation = useMutation({
        mutationFn: async (input: UpdateBookingStatusInput) => {
          const { data, error } = await supabase
            .from("bookings")
            .update({
              status: input.status,
              cancellation_note: input.cancellation_note ?? null,
            })
            .eq("id", input.id)
            .eq("coach_id", userId!)
            .select(BOOKING_COLUMNS)
            .single();
          if (error) throw error;
          return data as unknown as Booking;
        },
        onMutate: async (input) => {
          await queryClient.cancelQueries({ queryKey: ["bookings", userId] });
          const snapshots = queryClient.getQueriesData<Booking[]>({
            queryKey: ["bookings", userId],
          });
          // Optimistically drop the row from every cached tab — it no longer
          // matches the tab it's visible in. The refetch on settle re-places it
          // in the correct tab.
          for (const [key, list] of snapshots) {
            queryClient.setQueryData<Booking[]>(
              key,
              (list ?? []).filter((b) => b.id !== input.id),
            );
          }
          return { snapshots };
        },
        onError: (_err, _input, context) => {
          for (const [key, list] of context?.snapshots ?? []) {
            queryClient.setQueryData(key, list);
          }
          toast.error("Couldn't update the booking — try again.");
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["bookings", userId] });
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    // ── Contact (public) ─────────────────────────────────────────────────────
    useCreateContactMessage: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreateContactMessageInput) => {
          const ownerId = await resolveOwnerCoachId();
          // Anon can insert but not read back — omit `.select()` to avoid
          // the RLS read-back blocking an otherwise-successful submit.
          const { error } = await supabase.from("contact_messages").insert({
            coach_id: ownerId,
            name: input.name,
            email: input.email,
            subject: input.subject,
            inquiry_type: input.inquiry_type,
            message: input.message,
            status: "new",
          });
          if (error) throw error;
          return null;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
        onError: () => {
          toast.error("Couldn't send your message — please try again.");
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    // ── Admin messages ─────────────────────────────────────────────────────
    useMessages: (filters) => {
      const { data, isLoading } = useQuery({
        queryKey: ["messages", userId, filters.tab],
        queryFn: async () => {
          let query = supabase
            .from("contact_messages")
            .select(MESSAGE_COLUMNS)
            .eq("coach_id", userId!);

          if (filters.tab === "all") {
            query = query.in("status", ["new", "read"]);
          } else if (filters.tab === "new") {
            query = query.eq("status", "new");
          } else {
            query = query.eq("status", "read");
          }

          const { data, error } = await query.order("created_at", {
            ascending: false,
          });
          if (error) throw error;
          return (data ?? []) as unknown as ContactMessage[];
        },
        enabled: !!userId,
      });
      return { data: data ?? [], isLoading };
    },

    useUpdateMessageStatus: () => {
      const mutation = useMutation({
        mutationFn: async (input: UpdateMessageStatusInput) => {
          const { data, error } = await supabase
            .from("contact_messages")
            .update({ status: input.status })
            .eq("id", input.id)
            .eq("coach_id", userId!)
            .select(MESSAGE_COLUMNS)
            .single();
          if (error) throw error;
          return data as unknown as ContactMessage;
        },
        onMutate: async (input) => {
          await queryClient.cancelQueries({ queryKey: ["messages", userId] });
          const snapshots = queryClient.getQueriesData<ContactMessage[]>({
            queryKey: ["messages", userId],
          });
          for (const [key, list] of snapshots) {
            queryClient.setQueryData<ContactMessage[]>(key, (current) =>
              (current ?? [])
                // Archive removes from every tab; read stays visible with an
                // updated status until refetch re-buckets it.
                .filter((m) =>
                  input.status === "archived" ? m.id !== input.id : true,
                )
                .map((m) =>
                  m.id === input.id ? { ...m, status: input.status } : m,
                ),
            );
          }
          return { snapshots };
        },
        onError: (_err, _input, context) => {
          for (const [key, list] of context?.snapshots ?? []) {
            queryClient.setQueryData(key, list);
          }
          toast.error("Couldn't update the message — try again.");
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["messages", userId] });
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },
  };

  return (
    <DataProviderContext.Provider value={provider}>
      {children}
    </DataProviderContext.Provider>
  );
}
