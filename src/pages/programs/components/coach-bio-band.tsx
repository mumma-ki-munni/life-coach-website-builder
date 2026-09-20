import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

// Portrait for the bio band — the coach swaps it in Lovable.
const PORTRAIT_IMAGE =
  "https://images.unsplash.com/photo-1525186692211-2b1988cfe127?w=900&q=80&auto=format&fit=crop";

/**
 * "Meet your coach" — a full editorial band for Programs-only visitors who
 * haven't seen /about: a large portrait beside an oversized heading, a
 * generously sized bio, and credentials. Sized to the page's type scale rather
 * than a compressed footnote.
 */
export function CoachBioBand() {
  return (
    <section className="overflow-hidden border-t border-border">
      <div className="mx-auto max-w-page px-6 py-20 lg:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12">
          <Reveal order={0} className="lg:col-span-5">
            <img
              src={PORTRAIT_IMAGE}
              alt="Your coach"
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>

          <div className="mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <Reveal
              as="p"
              order={1}
              className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
            >
              Meet your coach
            </Reveal>
            <SegmentedText
              as="h2"
              baseDelayMs={120}
              className="mt-5 block text-balance font-heading text-4xl font-medium leading-[1.02] tracking-tight text-foreground lg:text-6xl"
            >
              Why I coach
            </SegmentedText>
            <Reveal
              as="p"
              order={3}
              className="mt-6 max-w-xl text-pretty text-xl leading-relaxed text-foreground lg:text-2xl"
            >
              I spent 12 years climbing the wrong ladder before I understood
              what I wanted. Now I help other people find that out sooner.
            </Reveal>
            <Reveal
              as="p"
              order={4}
              className="mt-8 text-sm uppercase tracking-[0.18em] text-muted-foreground"
            >
              ICF Certified · Co-Active Training · 7 years
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
