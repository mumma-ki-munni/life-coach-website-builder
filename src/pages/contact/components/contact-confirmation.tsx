import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Success state — replaces the form in place (no navigation) after a message is
 * sent. Warm confirmation copy plus a nudge CTA to `/book` for visitors who now
 * feel ready to take the next step. No "send another message" affordance — one
 * message per visit; a follow-up is a page reload away.
 */
export function ContactConfirmation() {
  return (
    <div className="border border-border p-8 text-center lg:p-10">
      <CheckCircle
        className="mx-auto size-10 text-foreground"
        aria-hidden="true"
      />
      <h2 className="mt-6 text-balance text-xl font-semibold text-foreground">
        Thanks — your message is on its way.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-pretty text-foreground">
        I read every message personally and I'll get back to you within a couple
        of days.
      </p>
      <p className="mt-8 text-pretty text-muted-foreground">
        If you're ready to book a free intake call in the meantime:
      </p>
      <Button
        asChild
        size="lg"
        className="mt-4 rounded-none uppercase tracking-[0.12em] font-medium"
      >
        <Link to="/book">
          Book a free intake call
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
