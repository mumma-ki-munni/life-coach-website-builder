import { BookCta } from "@/pages/landing/components/book-cta";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

// Tall editorial portrait — the coach in warm, natural light. The photograph
// leads the page (a personal introduction, not a product demo), so it carries
// real visual weight alongside the welcome headline. Swapped in Lovable.
const PORTRAIT_IMAGE =
  "https://images.unsplash.com/photo-1525186402429-b4ff38bedec6?w=1200&q=80&auto=format&fit=crop";

/**
 * About hero (`hero-03` — tall editorial band). A large portrait photograph
 * paired with a conversational headline, a quiet subline, and the one site-wide
 * booking CTA. Text sits beside the image on a warm background — never over it —
 * so no gradient scrim is needed and the copy stays legible.
 */
export function AboutHero() {
  return (
    <section className="mx-auto max-w-page px-6 py-12 lg:px-8 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal order={0} className="overflow-hidden">
          <img
            src={PORTRAIT_IMAGE}
            alt="Your coach, in warm natural light"
            className="aspect-[4/5] w-full object-cover"
          />
        </Reveal>

        <div className="max-w-xl">
          <SegmentedText
            as="h1"
            baseDelayMs={90}
            className="block text-balance font-heading text-5xl font-normal leading-[1.02] tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Hi, I'm glad you're here.
          </SegmentedText>
          <Reveal
            as="p"
            order={2}
            className="mt-6 text-pretty text-lg text-foreground"
          >
            A life coach who believes clarity is earned, not given.
          </Reveal>
          <Reveal order={3} className="mt-8">
            <BookCta />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
