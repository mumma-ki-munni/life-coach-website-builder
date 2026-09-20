import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";
import { BookCta } from "./book-cta";

// Warm lifestyle photograph — a full-bleed band directly beneath the headline
// block. Editorial, never a corporate headshot. The coach swaps this in Lovable.
// Full-bleed band. Delivered pre-cropped to a wide ratio, face-targeted, so the
// portrait reads correctly edge-to-edge instead of cropping to just the eyes.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1525186492356-0fe09a5831df?w=2400&h=1500&fit=crop&crop=faces,edges&q=80&auto=format";

/**
 * Editorial hero: a text block on the warm beige background (eyebrow, headline,
 * subline, one CTA) followed by a full-bleed lifestyle photograph as its own
 * band. Text is never set over the image.
 */
export function HomeHero() {
  return (
    <section>
      <div className="mx-auto max-w-page px-6 py-16 text-center lg:px-8 lg:py-24">
        <Reveal
          as="p"
          order={0}
          className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
        >
          Your space to figure out what's next
        </Reveal>
        <SegmentedText
          as="h1"
          baseDelayMs={90}
          className="mx-auto mt-6 block max-w-5xl text-balance font-heading text-5xl font-normal leading-[0.98] tracking-tight text-foreground md:text-6xl lg:text-8xl"
        >
          Life Coach Website + CMS
        </SegmentedText>
        <Reveal
          as="p"
          order={2}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-foreground"
        >
          Coaching site with built-in booking
        </Reveal>
        <Reveal order={3} className="mt-8 flex justify-center">
          <BookCta />
        </Reveal>
      </div>

      <Reveal order={4} className="w-full">
        <img
          src={HERO_IMAGE}
          alt="A quiet moment of reflection"
          className="h-[56vh] w-full object-cover object-center lg:h-[78vh]"
        />
      </Reveal>
    </section>
  );
}
