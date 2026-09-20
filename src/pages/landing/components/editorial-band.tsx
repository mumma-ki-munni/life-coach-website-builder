import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";
import { BookCta } from "./book-cta";

export interface EditorialBandProps {
  overline: string;
  heading: string;
  body: string;
  image: string;
  imageAlt: string;
  /** Optional two-up prompt links (e.g. "Start where you are →"). */
  subLinks?: { label: string; href: string }[];
  /** When set, renders the site-wide Book CTA instead of sub-links. */
  cta?: boolean;
  /** Mirror the composition (heading right / body + image lean the other way). */
  flip?: boolean;
  /** Paint a lighter blush ground (same hue) to alternate against the coral base. */
  blush?: boolean;
}

/**
 * Editorial band, Collette-style: an oversized display heading paired with a
 * narrow body column dropped to its baseline (dramatic scale contrast + offset),
 * then a partial-width image set to one side with deliberate negative space
 * beside it. Not a 50/50 image|text split, and the type is never laid over the
 * subject. `flip` mirrors which side everything leans to.
 */
export function EditorialBand({
  overline,
  heading,
  body,
  image,
  imageAlt,
  subLinks,
  cta,
  flip,
  blush,
}: EditorialBandProps) {
  return (
    <section
      className={cn(
        "overflow-hidden border-t border-border",
        blush && "theme-blush bg-background",
      )}
    >
      <div className="mx-auto max-w-page px-6 py-20 lg:px-8 lg:py-28">
        {/* Header row: giant heading + narrow, baseline-dropped body column */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <SegmentedText
            as="h2"
            baseDelayMs={120}
            className={cn(
              "block max-w-[14ch] text-balance font-heading text-5xl font-medium leading-[0.98] tracking-tight text-foreground lg:col-span-7 lg:text-7xl",
              flip ? "lg:col-start-6" : "lg:col-start-1",
            )}
          >
            {heading}
          </SegmentedText>

          <div
            className={cn(
              "mt-8 lg:col-span-4 lg:mt-0 lg:self-end",
              flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-9",
            )}
          >
            <Reveal
              as="p"
              order={1}
              className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
            >
              {overline}
            </Reveal>
            <Reveal
              as="p"
              order={2}
              className="mt-4 text-pretty text-lg text-foreground"
            >
              {body}
            </Reveal>

            {subLinks && subLinks.length > 0 && (
              <Reveal
                order={3}
                className="mt-8 flex flex-col gap-4 border-t border-border pt-6"
              >
                {subLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
                  >
                    {link.label}
                    <ArrowRight className="size-4" />
                  </Link>
                ))}
              </Reveal>
            )}

            {cta && (
              <Reveal order={3} className="mt-8">
                <BookCta />
              </Reveal>
            )}
          </div>
        </div>

        {/* Offset partial-width image with negative space on the opposite side */}
        <Reveal
          order={2}
          className={cn(
            "mt-12 w-full lg:mt-16 lg:w-[64%]",
            flip ? "lg:ml-auto" : "lg:mr-auto",
          )}
        >
          <img
            src={image}
            alt={imageAlt}
            className="aspect-[3/2] w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
