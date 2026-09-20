import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

interface ApproachColumn {
  /** Ordinal marker — the three steps run in sequence, every session. */
  step: string;
  title: string;
  body: string;
}

// Static philosophy copy. Not data — no DataProvider hook — so the verbatim seed
// copy lives here as page content. Discover → Challenge → Move is an ordered
// process, so the numeric markers carry real meaning, not decoration.
const COLUMNS: ApproachColumn[] = [
  {
    step: "01",
    title: "Discover",
    body: "We slow down first. Most of my clients arrive with a solution when they haven't yet understood the real problem.",
  },
  {
    step: "02",
    title: "Challenge",
    body: "I won't tell you what to do. I'll ask you the questions that help you find the answer that's already in you.",
  },
  {
    step: "03",
    title: "Move",
    body: "Insight without action is just interesting. We build in concrete next steps every session — small, real, yours.",
  },
];

/**
 * "My Approach" — an oversized display heading and a short intro, then the three
 * ordered movements as numbered editorial columns (hairline top rules, large
 * Fraunces titles). Matches the Home page's scale and rhythm.
 */
export function ApproachColumns() {
  return (
    <section className="overflow-hidden border-t border-border">
      <div className="mx-auto max-w-page px-6 py-20 lg:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <SegmentedText
            as="h2"
            baseDelayMs={120}
            className="block max-w-[13ch] text-balance font-heading text-5xl font-medium leading-[0.98] tracking-tight text-foreground lg:col-span-7 lg:text-7xl"
          >
            How we'll work together
          </SegmentedText>
          <Reveal
            as="p"
            order={1}
            className="mt-6 text-pretty text-lg text-foreground lg:col-span-4 lg:col-start-9 lg:mt-0 lg:text-xl"
          >
            Three movements, every session — the same shape, whatever you bring.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3 lg:mt-20">
          {COLUMNS.map((column, i) => (
            <Reveal
              key={column.title}
              order={1 + i}
              className="border-t border-border pt-6"
            >
              <span className="font-heading text-2xl text-muted-foreground">
                {column.step}
              </span>
              <h3 className="mt-4 font-heading text-3xl font-medium tracking-tight text-foreground">
                {column.title}
              </h3>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground">
                {column.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
