import { Reveal } from "@/lib/animations/reveal";

// Full-bleed image with a single overlaid outcome line — the emotional beat
// after the three program bands. Deliberately unattributed: the line reads as a
// general outcome, not a named client quote. The coach swaps the image in
// Lovable. Static marketing copy — no DataProvider hook exists for it.
const OUTCOME_IMAGE =
  "https://images.unsplash.com/photo-1525186633414-7198247b34f8?w=1600&q=80&auto=format&fit=crop";

/**
 * "How you'll feel" — a full-bleed image band with an overline and one short
 * outcome line overlaid in light type. One statement, one image, one beat.
 */
export function ProgramsOutcomeBand() {
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
          How you'll feel
        </Reveal>
        <Reveal
          as="blockquote"
          order={1}
          className="mt-6 max-w-3xl text-balance font-heading text-4xl font-medium leading-[1.05] text-white lg:text-5xl"
        >
          &ldquo;Clearer, calmer, and finally moving in a direction that's
          mine.&rdquo;
        </Reveal>
      </div>
    </section>
  );
}
