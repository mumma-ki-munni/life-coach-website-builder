import { useState } from "react";
import { SiteHeader } from "@/pages/landing/components/site-header";
import { SiteFooter } from "@/pages/landing/components/site-footer";
import { ContactIntro } from "./components/contact-intro";
import { ContactForm } from "./components/contact-form";
import { ContactConfirmation } from "./components/contact-confirmation";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

/**
 * Contact (`/contact`) — a simple general-inquiry form. Submissions are stored
 * in `contact_messages` (a guest RLS insert via `useCreateContactMessage`) and
 * read by the coach in the admin Messages inbox. Visitors who are ready to book
 * are pointed at `/book` in the intro. On successful submit the form is replaced
 * in place by a confirmation panel — no navigation. The "Contact" nav link gets
 * its active treatment from the shared `SiteHeader`.
 */
export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="theme-blush flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-page px-6 py-16 lg:px-8 lg:py-24">
          {sent ? (
            <div className="mx-auto max-w-2xl space-y-10 text-center">
              <SegmentedText
                as="h1"
                className="block text-balance font-heading text-4xl font-medium leading-[1.02] tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                Get in touch
              </SegmentedText>
              <ContactConfirmation />
            </div>
          ) : (
            // Two-up: the editorial intro on the left, the form (a white card
            // that comes forward on the cream ground) on the right.
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
              <div>
                <SegmentedText
                  as="h1"
                  className="block text-balance font-heading text-4xl font-medium leading-[1.02] tracking-tight text-foreground md:text-5xl lg:text-6xl"
                >
                  Get in touch
                </SegmentedText>
                <Reveal order={1} className="mt-8">
                  <ContactIntro />
                </Reveal>
              </div>
              <Reveal order={2}>
                <ContactForm onSent={() => setSent(true)} />
              </Reveal>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
