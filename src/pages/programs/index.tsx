import { SiteHeader } from "@/pages/landing/components/site-header";
import { SiteFooter } from "@/pages/landing/components/site-footer";
import { ConsultationBand } from "@/pages/landing/components/consultation-band";
import { ProgramsHeading } from "./components/programs-heading";
import { ProgramBands } from "./components/program-bands";
import { ProgramsOutcomeBand } from "./components/programs-outcome-band";
import { FaqAccordion } from "./components/faq-accordion";
import { CoachBioBand } from "./components/coach-bio-band";

/**
 * Programs (`/programs`) — the full programs page. A centered editorial heading,
 * three image-left program bands (from `useActivePrograms()`), a full-bleed
 * outcome band, a FAQ accordion, a compressed coach bio, and the closing
 * booking CTA. Static marketing page — always populated. The shared `SiteHeader`
 * gives the "Programs" nav link its active treatment automatically.
 */
export default function Programs() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <ProgramsHeading />

        <ProgramBands />

        <ProgramsOutcomeBand />

        <FaqAccordion />

        <CoachBioBand />

        <ConsultationBand
          overline="Ready to talk?"
          heading="Book your free intake call"
          bullets={[
            "Not sure which program fits? That's exactly what the intake call is for.",
          ]}
          blush
        />
      </main>

      <SiteFooter />
    </div>
  );
}
