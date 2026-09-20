import { cn } from "@/lib/utils";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";
import { BookCta } from "./book-cta";

// Warm lifestyle image for the closing band. Swapped by the coach in Lovable.
const CONSULT_IMAGE =
  "https://images.unsplash.com/photo-1525186402429-b4ff38bedec6?w=1600&q=80&auto=format&fit=crop";

export interface ConsultationBandProps {
  overline: string;
  heading: string;
  bullets: string[];
  /** Paint a lighter blush ground (same hue) instead of the coral base. */
  blush?: boolean;
}

/**
 * Closing band, asymmetric: an oversized heading + value list + Book CTA holding
 * the left six columns, with a single warm photograph set smaller and offset in
 * the right five (a column of negative space between) — a calmer bookend than a
 * 50/50 split.
 */
export function ConsultationBand({
  overline,
  heading,
  bullets,
  blush,
}: ConsultationBandProps) {
  return (
    <section
      className={cn(
        "overflow-hidden border-t border-border",
        blush && "theme-blush bg-background",
      )}
    >
      <div className="mx-auto max-w-page px-6 py-20 lg:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
          <div className="lg:col-span-6 lg:col-start-1">
            <Reveal
              as="p"
              order={0}
              className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
            >
              {overline}
            </Reveal>
            <SegmentedText
              as="h2"
              baseDelayMs={90}
              className="mt-5 block max-w-[14ch] text-balance font-heading text-5xl font-medium leading-[0.98] tracking-tight text-foreground lg:text-6xl"
            >
              {heading}
            </SegmentedText>
            <ul className="mt-8 space-y-3">
              {bullets.map((bullet, i) => (
                <Reveal
                  as="li"
                  key={bullet}
                  order={2 + i}
                  className="text-pretty text-lg text-foreground"
                >
                  {bullet}
                </Reveal>
              ))}
            </ul>
            <Reveal order={2 + bullets.length} className="mt-8">
              <BookCta />
            </Reveal>
          </div>

          <Reveal
            order={3 + bullets.length}
            className="mt-12 w-full lg:col-span-5 lg:col-start-8 lg:mt-0"
          >
            <img
              src={CONSULT_IMAGE}
              alt="Warm and at ease"
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
