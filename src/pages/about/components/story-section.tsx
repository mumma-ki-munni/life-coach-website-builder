import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

// Static marketing copy — the coach's personal narrative. Not filterable data
// and there is no DataProvider hook for it, so the verbatim seed copy lives here
// as page content the coach edits in Lovable (mirrors the Home page pattern).
const STORY_P1 =
  "I didn't become a coach because everything went right for me. I became a coach because I spent years getting it wrong — the prestigious jobs, the external markers of success that felt hollow on a Tuesday morning.";
const STORY_P2 =
  "After a career in finance and a decade of looking successful on paper, I found a coach who asked me the questions nobody else was asking. It changed everything. I trained at the Co-Active Training Institute, earned my ICF certification, and have spent the last seven years doing for others what that coach did for me.";

/**
 * "My Story" — an editorial band (Collette-style): an oversized display line on
 * one side, the narrative dropped to its baseline on the other, with real scale
 * contrast between them. On a blush ground (a lighter tint of the coral base).
 */
export function StorySection() {
  return (
    <section className="theme-blush overflow-hidden border-t border-border bg-background">
      <div className="mx-auto max-w-page px-6 py-20 lg:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <SegmentedText
            as="h2"
            baseDelayMs={120}
            className="block max-w-[11ch] text-balance font-heading text-5xl font-medium leading-[0.98] tracking-tight text-foreground lg:col-span-6 lg:text-7xl"
          >
            I got it wrong first.
          </SegmentedText>

          <div className="mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:self-end">
            <Reveal
              as="p"
              order={1}
              className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
            >
              My story
            </Reveal>
            <div className="mt-6 space-y-6">
              <Reveal
                as="p"
                order={2}
                className="text-pretty text-lg leading-relaxed text-foreground lg:text-xl"
              >
                {STORY_P1}
              </Reveal>
              <Reveal
                as="p"
                order={3}
                className="text-pretty text-lg leading-relaxed text-foreground lg:text-xl"
              >
                {STORY_P2}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
