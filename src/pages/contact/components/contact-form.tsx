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
import {
  useDataProvider,
  type CreateContactMessageInput,
} from "@/lib/data-provider";

// The inquiry-type union comes from the DataProvider's create input, so data
// still flows through `useDataProvider` — never a direct `data/seed` import.
type InquiryType = CreateContactMessageInput["inquiry_type"];

// Static list of inquiry types — a fixed set, not a persisted table, so it
// lives with the form that uses it. Verbatim from the screenboard.
const INQUIRY_TYPES: InquiryType[] = [
  "General Question",
  "Press / Media",
  "Collaboration",
  "Other",
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  inquiry_type: z.string().min(1, "Please choose an inquiry type."),
  subject: z.string().trim().min(1, "Please enter a subject."),
  message: z.string().trim().min(1, "Please enter a message."),
});

type ContactValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSent: () => void;
}

/**
 * The contact form — Name, Email, Inquiry type, Subject, Message, all required.
 * Submits via `useCreateContactMessage` (a guest RLS insert into
 * `contact_messages` with status "new") and, on success, hands control up so
 * the page can swap to the confirmation panel (same page, no navigation).
 */
export function ContactForm({ onSent }: ContactFormProps) {
  const data = useDataProvider();
  const { mutate: createMessage, isPending } = data.useCreateContactMessage();

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      inquiry_type: "",
      subject: "",
      message: "",
    },
  });

  // The DataProvider types `mutate` as `(input) => void`, but under the hood it
  // is React Query's `mutate`, which accepts a per-call options object. The
  // cloudboard requires transitioning to the confirmation state on success, so
  // we widen the type at this one call site to pass an `onSuccess` callback.
  const submitMessage = createMessage as (
    input: CreateContactMessageInput,
    options?: { onSuccess?: () => void },
  ) => void;

  const onSubmit = (values: ContactValues) => {
    submitMessage(
      {
        name: values.name,
        email: values.email,
        subject: values.subject,
        inquiry_type: values.inquiry_type as InquiryType,
        message: values.message,
      },
      { onSuccess: onSent },
    );
  };

  return (
    <div className="border border-border bg-white p-8 shadow-sm lg:p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
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
            name="inquiry_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inquiry type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INQUIRY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject *</FormLabel>
                <FormControl>
                  <Input placeholder="What's this about?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message *</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="What would you like to share…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full rounded-none uppercase tracking-[0.12em] font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending…
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
