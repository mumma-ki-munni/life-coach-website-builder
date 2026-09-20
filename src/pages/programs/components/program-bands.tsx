import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/base/badge";
import { Button } from "@/components/ui/button";
import { useDataProvider, type Program } from "@/lib/data-provider";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

/**
 * A single program, composed typographically (Collette-style) rather than as an
 * image|text half-and-half: an oversized program name on one side, and a narrow
 * "what we cover" column dropped alongside it on the other, with negative space
 * between. No per-program photograph — the page's imagery lives in the outcome
 * band and the coach bio, so the programs read as a clean editorial list.
 * Alternates sides by index.
 */
function ProgramBand({ program, index }: { program: Program; index: number }) {
  const flip = index % 2 === 1;

  return (
    <section
      className={cn(
        "overflow-hidden border-t border-border",
        flip && "theme-blush bg-background",
      )}
    >
      <div className="mx-auto max-w-page px-6 py-20 lg:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
          {/* Name side */}
          <div
            className={cn(
              "lg:col-span-7",
              flip ? "lg:col-start-6" : "lg:col-start-1",
            )}
          >
            <Reveal
              order={0}
              className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
            >
              <span>Program</span>
              <span aria-hidden="true" className="h-px w-8 bg-border" />
              <Badge color="gray" className="rounded-full normal-case tracking-normal">
                {program.duration_label}
              </Badge>
            </Reveal>
            <SegmentedText
              as="h2"
              baseDelayMs={120}
              className="mt-5 block max-w-[16ch] text-balance font-heading text-5xl font-medium leading-[0.98] tracking-tight text-foreground lg:text-7xl"
            >
              {program.name}
            </SegmentedText>
            <Reveal
              as="p"
              order={2}
              className="mt-6 max-w-md text-pretty text-lg italic text-muted-foreground"
            >
              {program.who_its_for}
            </Reveal>
          </div>

          {/* "What we cover" column — narrow, dropped to the baseline */}
          <div
            className={cn(
              "mt-10 lg:col-span-4 lg:mt-0 lg:self-end",
              flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-9",
            )}
          >
            <Reveal
              as="p"
              order={1}
              className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
            >
              What we cover
            </Reveal>
            <ul className="mt-4 space-y-2">
              {program.description.map((item, i) => (
                <Reveal
                  as="li"
                  key={item}
                  order={2 + i}
                  className="flex gap-3 text-pretty text-foreground"
                >
                  <span aria-hidden="true" className="text-muted-foreground">
                    ·
                  </span>
                  <span>{item}</span>
                </Reveal>
              ))}
            </ul>
            <Reveal order={2 + program.description.length} className="mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-none font-medium uppercase tracking-[0.12em]"
              >
                <Link to="/book">
                  Book a free intake call
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The program list — active programs (sorted by display_order) from the
 * DataProvider. Deactivated programs never reach this component.
 */
export function ProgramBands() {
  const { data: programs, isLoading } = useDataProvider().useActivePrograms();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-page px-6 lg:px-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-t border-border py-20 lg:py-28">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-7">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-12 w-2/3 rounded bg-muted" />
                <div className="h-5 w-full rounded bg-muted" />
              </div>
              <div className="space-y-3 lg:col-span-4 lg:col-start-9">
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-4/6 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return null;
  }

  return (
    <div>
      {programs.map((program, index) => (
        <ProgramBand key={program.id} program={program} index={index} />
      ))}
    </div>
  );
}
