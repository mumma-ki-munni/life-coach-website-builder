import { CheckCircle, Clock, Compass, MessageCircle, type LucideIcon } from "lucide-react";

interface ValueItem {
  icon: LucideIcon;
  /** Full description shown in the first-time (pre-selection) layout. */
  full: string;
  /** Short label shown in the compact 2×2 grid once a date is picked. */
  short: string;
}

// Static marketing copy — this panel sells the 30-minute intake call itself,
// not "what coaching is" (that lives on /programs). Verbatim from the
// screenboard wireframe.
const ITEMS: ValueItem[] = [
  {
    icon: MessageCircle,
    full: "A real conversation about what you're working through — no script, no sales pitch",
    short: "A real conversation",
  },
  {
    icon: CheckCircle,
    full: "An honest read on whether we're a good fit",
    short: "Honest fit read",
  },
  {
    icon: Compass,
    full: "A recommended next step — the program that fits, if there is one",
    short: "Recommended next step",
  },
  {
    icon: Clock,
    full: "30 minutes, free, zero pressure",
    short: "30 min, free",
  },
];

/**
 * The value pitch for the intake call. Renders four icon + text rows in the
 * first-time state; once a date is selected (`compact`), it collapses to a
 * quiet 2×2 grid so the viewport stays focused on the calendar + form. The
 * pitch has done its job by the time the visitor clicks a date.
 *
 * `bare` drops the page-width wrapper so the parent can place the panel inside
 * its own layout grid (the first-time two-up: pitch left, calendar right).
 */
export function ValuePanel({
  compact,
  bare = false,
}: {
  compact: boolean;
  bare?: boolean;
}) {
  const inner = compact ? (
    <div className="theme-blush grid grid-cols-1 gap-x-8 gap-y-3 border border-border bg-background p-6 sm:grid-cols-2">
      {ITEMS.map(({ icon: Icon, short }) => (
        <div key={short} className="flex items-center gap-3">
          <Icon className="size-5 shrink-0 text-foreground" aria-hidden="true" />
          <span className="text-pretty text-foreground">{short}</span>
        </div>
      ))}
    </div>
  ) : (
    // Plain on the page ground — no filled box — so the calendar carries the
    // contrast. Hairline dividers keep it editorial.
    <div>
      <h2 className="max-w-[16ch] text-balance font-heading text-3xl font-medium leading-[1.05] tracking-tight text-foreground lg:text-4xl">
        What your free intake includes
      </h2>
      <ul className="mt-10 space-y-6 lg:mt-12 lg:space-y-8">
        {ITEMS.map(({ icon: Icon, full }) => (
          <li key={full} className="flex gap-5 border-t border-border pt-6">
            <Icon
              className="mt-1 size-6 shrink-0 text-foreground"
              aria-hidden="true"
            />
            <span className="text-pretty text-xl text-foreground lg:text-2xl">
              {full}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (bare) return inner;
  return <div className="mx-auto max-w-page px-6 lg:px-8">{inner}</div>;
}
