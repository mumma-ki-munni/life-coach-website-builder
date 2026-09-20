import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { HomeHero } from "./components/home-hero";
import { ServicesOverview } from "./components/services-overview";
import { EditorialBand } from "./components/editorial-band";
import { OutcomeBand } from "./components/outcome-band";
import { ConsultationBand } from "./components/consultation-band";

// Static marketing copy for the editorial / outcome / consultation bands. These
// are not filterable data — there is no DataProvider hook for them — so the
// verbatim seed copy lives here as page content the coach edits in Lovable. The
// program teaser cards ARE data and flow through `useActivePrograms()` inside
// <ProgramsTeaser />.
const APPROACH_IMAGE =
  "https://images.unsplash.com/photo-1525186692211-2b1988cfe127?w=1200&q=80&auto=format&fit=crop";
const TOGETHER_IMAGE =
  "https://images.unsplash.com/photo-1525186633414-7198247b34f8?w=1200&q=80&auto=format&fit=crop";

/**
 * Home (`/`) — the marketing landing page. Visitors read who the coach is, scan the
 * three program teasers, and are invited repeatedly to book a free intake call.
 */
export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <HomeHero />

        <ServicesOverview />

        <EditorialBand
          overline="My Approach"
          heading="Stuck isn't a personality trait"
          body="Most of my clients arrive with a solution when they haven't yet understood the real problem. We slow down before we speed up."
          image={APPROACH_IMAGE}
          imageAlt="Listening during a coaching session"
          subLinks={[
            { label: "Start where you are", href: "/about" },
            { label: "Name what's stuck", href: "/about" },
          ]}
        />

        <EditorialBand
          overline="Working Together"
          heading="What a plan that fits looks like"
          body="A free intake → an honest read on fit → a plan built around your life, not a template."
          image={TOGETHER_IMAGE}
          imageAlt="At home, between sessions"
          cta
          flip
          blush
        />

        <OutcomeBand
          overline="How it feels"
          quote="Within three months I left a job that was making me miserable and started something I actually care about."
          attribution="Marcus T., Career Clarity client"
        />

        <ConsultationBand
          overline="Ready to talk?"
          heading="Book your free intake call"
          bullets={[
            "A real conversation, no script",
            "An honest read on whether we fit",
            "A recommended next step",
            "30 minutes, free",
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
