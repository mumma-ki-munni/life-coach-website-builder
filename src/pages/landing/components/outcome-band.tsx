import { Reveal } from "@/lib/animations/reveal";

// Full-bleed image with an overlaid client quote — the emotional beat of the
// page. One quote, no carousel, no avatar.
const OUTCOME_IMAGE =
  "https://images.unsplash.com/photo-1525186692211-2b1988cfe127?w=1600&q=80&auto=format&fit=crop";

export interface OutcomeBandProps {
  overline: string;
  quote: string;
  attribution: string;
}

/**
 * Full-bleed image band with an overline and a large client quote overlaid in
 * light type, attribution below in smaller type.
 */
export function OutcomeBand({ overline, quote, attribution }: OutcomeBandProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={OUTCOME_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <div className="mx-auto max-w-page px-6 py-24 lg:px-8 lg:py-32">
        <Reveal
          as="p"
          order={0}
          className="text-xs font-medium uppercase tracking-[0.24em] text-white/60"
        >
          {overline}
        </Reveal>
        <Reveal
          as="blockquote"
          order={1}
          className="mt-6 max-w-3xl text-balance font-heading text-4xl font-medium leading-[1.05] text-white lg:text-5xl"
        >
          &ldquo;{quote}&rdquo;
        </Reveal>
        <Reveal as="p" order={2} className="mt-6 text-sm text-white/60">
          — {attribution}
        </Reveal>
      </div>
    </section>
  );
}
