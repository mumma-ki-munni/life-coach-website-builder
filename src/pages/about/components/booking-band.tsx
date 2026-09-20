import { BookCta } from "@/pages/landing/components/book-cta";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

/**
 * Closing booking CTA (`cta-03` — centered, calm). One line of copy and the
 * single site-wide booking button. No secondary link: a visitor who has read
 * the whole story has one logical next step — booking a call.
 */
export function BookingBand() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-page px-6 py-20 text-center lg:px-8 lg:py-28">
        <SegmentedText
          as="h2"
          className="block text-balance font-heading text-5xl font-medium tracking-tight text-foreground lg:text-6xl"
        >
          Ready to have a real conversation?
        </SegmentedText>
        <Reveal order={2} className="mt-8 flex justify-center">
          <BookCta />
        </Reveal>
      </div>
    </section>
  );
}
