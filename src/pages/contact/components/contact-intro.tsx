import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * The editorial intro above the form. Explains who this form is for (press,
 * collaboration, pre-booking questions) and points visitors who are ready to
 * book straight to `/book` — the booking page has the full intake experience,
 * so a "ready to book" visitor should go there rather than send an informal
 * message. Static marketing copy, verbatim from the screenboard.
 */
export function ContactIntro() {
  return (
    // Plain on the cream ground — the form card carries the contrast.
    <div className="max-w-md">
      <p className="text-pretty text-xl text-foreground lg:text-2xl">
        I read every message personally.
      </p>
      <p className="mt-6 text-pretty text-foreground">
        If you're ready to book a free intake call, the fastest way is to{" "}
        <Link
          to="/book"
          className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
        >
          go straight to the booking page
          <ArrowRight className="ml-1 inline size-4 align-[-2px]" aria-hidden="true" />
        </Link>
        .
      </p>
      <p className="mt-4 text-pretty text-foreground">
        For everything else — press inquiries, collaboration, or a question
        before you're ready to book — use the form below.
      </p>
    </div>
  );
}
