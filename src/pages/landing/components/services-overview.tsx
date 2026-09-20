import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

interface Service {
  title: string;
  body: string;
  cta: string;
  href: string;
}

// The three ways to work with the coach. Static, hand-authored content (not the
// DB-driven program list) — a Myhra-style "Work with me" overview that maps each
// column to a real destination on the site.
const SERVICES: Service[] = [
  {
    title: "1:1 Coaching",
    body: "Private weekly sessions, a plan built around your life — never a template.",
    cta: "How I work",
    href: "/about",
  },
  {
    title: "Focused Programs",
    body: "Eight to twelve weeks on one real crossroads — career, transition, confidence.",
    cta: "See programs",
    href: "/programs",
  },
  {
    title: "Free Intake Call",
    body: "Start with a real conversation. No script, no pressure — 30 minutes.",
    cta: "Book a call",
    href: "/book",
  },
];

/**
 * "Work with me" — a centered heading over three service columns (title,
 * one-line description, and a "learn more" link into the relevant page). The
 * static counterpart to the DB-driven ProgramsTeaser, so the home page always
 * shows how to work together even before any programs are published.
 */
export function ServicesOverview() {
  return (
    <section className="theme-blush border-t border-border bg-background">
      <div className="mx-auto max-w-page px-6 py-20 text-center lg:px-8 lg:py-28">
        <SegmentedText
          as="h2"
          className="mx-auto block max-w-3xl text-balance font-heading text-4xl font-medium leading-[1.02] tracking-tight text-foreground lg:text-6xl"
        >
          Work with me
        </SegmentedText>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3 lg:mt-20 lg:gap-16">
          {SERVICES.map((service, i) => (
            <Reveal
              key={service.title}
              order={i}
              className="flex flex-col items-start text-left md:items-center md:text-center"
            >
              <h3 className="font-heading text-2xl font-medium tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mt-4 max-w-xs text-pretty text-foreground">
                {service.body}
              </p>
              <Link
                to={service.href}
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 transition-opacity hover:opacity-70"
              >
                {service.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
