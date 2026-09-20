import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDataProvider, type CreateBookingInput } from "@/lib/data-provider";
import { format } from "date-fns";
import { formatSlotShort, parseISODate } from "../lib";

// Matches the seed `focusAreas` list — a fixed set of intake focus areas, not a
// persisted table, so it lives with the form that uses it.
const FOCUS_AREAS = [
  "Career & Work",
  "Relationships & Family",
  "Confidence & Self-Worth",
  "Major Life Transition",
  "Other",
] as const;

const NONE_PROGRAM = "__none__";

const goalsSchema = z.object({
  client_name: z.string().trim().min(1, "Please enter your full name."),
  client_email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Enter a valid email address."),
  client_phone: z.string().trim().optional(),
  focus_area: z.string().min(1, "Please choose a focus area."),
  goals: z
    .string()
    .trim()
    .min(1, "Tell me a little about where you are."),
  program_interest_id: z.string().optional(),
});

type GoalsValues = z.infer<typeof goalsSchema>;

export interface ConfirmedBooking {
  clientName: string;
  bookingDate: string;
  bookingTime: string;
}

interface GoalsFormProps {
  selectedDate: string;
  selectedTime: string;
  onConfirmed: (booking: ConfirmedBooking) => void;
}

/**
 * Step 2 — the guest goals form. Guest booking only: no account, no password,
 * no payment. On submit it creates the booking via `useCreateBooking` and, on
 * success, hands the confirmed details up so the page can swap to the
 * confirmation screen (no navigation).
 */
export function GoalsForm({
  selectedDate,
  selectedTime,
  onConfirmed,
}: GoalsFormProps) {
  const data = useDataProvider();
  const { data: programs } = data.useActivePrograms();
  const { mutate: createBooking, isPending } = data.useCreateBooking();

  const form = useForm<GoalsValues>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      client_name: "",
      client_email: "",
      client_phone: "",
      focus_area: "",
      goals: "",
      program_interest_id: NONE_PROGRAM,
    },
  });

  const dateTimeLabel = `${format(
    parseISODate(selectedDate),
    "MMM d",
  ).toUpperCase()}, ${formatSlotShort(selectedTime)}`;
  const fullSubmitLabel = `Confirm booking for ${dateTimeLabel}`;
  const shortSubmitLabel = "Confirm booking";

  // The DataProvider types `mutate` as `(input) => void`, but under the hood it
  // is React Query's `mutate`, which accepts a per-call options object. The
  // cloudboard requires transitioning to the confirmation screen on success, so
  // we widen the type at this one call site to pass an `onSuccess` callback.
  const submitBooking = createBooking as (
    input: CreateBookingInput,
    options?: { onSuccess?: () => void },
  ) => void;

  const onSubmit = (values: GoalsValues) => {
    submitBooking(
      {
        client_name: values.client_name,
        client_email: values.client_email,
        client_phone: values.client_phone?.trim() ? values.client_phone : null,
        focus_area: values.focus_area,
        goals: values.goals,
        program_interest_id:
          values.program_interest_id && values.program_interest_id !== NONE_PROGRAM
            ? values.program_interest_id
            : null,
        booking_date: selectedDate,
        booking_time: selectedTime,
      },
      {
        onSuccess: () =>
          onConfirmed({
            clientName: values.client_name,
            bookingDate: selectedDate,
            bookingTime: selectedTime,
          }),
      },
    );
  };

  return (
    <div className="mx-auto max-w-page px-6 lg:px-8">
      <div className="mx-auto max-w-2xl border border-border bg-card p-8 lg:p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number (optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="focus_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus area *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-none">
                        <SelectValue placeholder="Choose a focus area…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FOCUS_AREAS.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tell me a little about where you are and what you're hoping
                    for *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="What's bringing you here…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program_interest_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Which program are you curious about? (optional)
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none">
                        <SelectValue placeholder="No preference yet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_PROGRAM}>
                        No preference yet
                      </SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground sm:hidden">
                Booking for{" "}
                <span className="font-medium text-foreground">
                  {dateTimeLabel}
                </span>
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full rounded-none uppercase tracking-[0.12em] font-medium sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Confirming…
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">{shortSubmitLabel}</span>
                    <span className="hidden sm:inline">{fullSubmitLabel}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
