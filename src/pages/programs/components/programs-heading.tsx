import { useDataProvider } from "@/lib/data-provider";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

/**
 * Programs page heading. A plain centered editorial heading — no hero
 * photograph, so the first program band sits high on the page. Uppercase,
 * letter-spaced title with a quiet subline beneath it. The subline text
 * adapts to how many active programs the coach has published (so the page
 * doesn't lie about "three programs" when there aren't three).
 */
export function ProgramsHeading() {
  const { data: programs, isLoading } = useDataProvider().useActivePrograms();

  let subline = "Programs designed around where you are.";
  if (!isLoading) {
    const count = programs.length;
    if (count === 1) {
      subline = "One program, one goal: a life that feels like yours.";
    } else if (count > 1) {
      const words = ["Two", "Three", "Four", "Five", "Six"];
      const word = words[count - 2] ?? `${count}`;
      subline = `${word} programs, one goal: a life that feels like yours.`;
    } else {
      subline = "New programs are coming soon.";
    }
  }

  return (
    <section className="mx-auto max-w-page px-6 py-16 text-center lg:px-8 lg:py-20">
      <SegmentedText
        as="h1"
        className="block text-balance font-heading text-4xl font-medium leading-[1.02] tracking-tight text-foreground md:text-5xl lg:text-6xl"
      >
        Ways we can work together
      </SegmentedText>
      <Reveal
        as="p"
        order={2}
        className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground"
      >
        {subline}
      </Reveal>
    </section>
  );
}
