import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  RefreshCw,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useDataProvider } from "@/lib/data-provider";
import { Reveal } from "@/lib/animations/reveal";

// Map the seed/DB `icon` string to a Lucide component. Falls back to Briefcase
// for any unknown value so a coach-added program never renders a blank slot.
const ICONS: Record<string, LucideIcon> = {
  Briefcase,
  RefreshCw,
  Star,
};

/**
 * "How I help" — three equal-width teaser cards, sorted by display_order, read
 * through `useActivePrograms()`. Each card is a signpost to `/programs`, not a
 * brochure: icon + uppercase name + one-line who-it's-for + "Learn more →".
 */
export function ProgramsTeaser() {
  const { data: programs, isLoading } = useDataProvider().useActivePrograms();

  // When there are no active programs (e.g. before the coach has added any),
  // hide the whole section rather than render an empty grid gap.
  if (!isLoading && programs.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-page px-6 py-16 lg:px-8 lg:py-20">
      <Reveal
        as="p"
        order={0}
        className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
      >
        How I help
      </Reveal>

      {isLoading ? (
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="size-8 rounded bg-muted" />
              <div className="h-5 w-40 rounded bg-muted" />
              <div className="h-16 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {programs.map((program, i) => {
            const Icon = ICONS[program.icon] ?? Briefcase;
            return (
              <Reveal
                key={program.id}
                order={1 + i}
                className="flex flex-col gap-4"
              >
                <Icon className="size-8 text-foreground" strokeWidth={1.5} />
                <h3 className="font-heading text-2xl font-medium tracking-tight text-foreground">
                  {program.name}
                </h3>
                <p className="text-pretty text-foreground">
                  {program.who_its_for}
                </p>
                <Link
                  to="/programs"
                  className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
                >
                  Learn more
                  <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
