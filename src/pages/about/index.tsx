import { SiteHeader } from "@/pages/landing/components/site-header";
import { SiteFooter } from "@/pages/landing/components/site-footer";
import { AboutHero } from "./components/about-hero";
import { StorySection } from "./components/story-section";
import { ApproachColumns } from "./components/approach-columns";
import { CredentialsList } from "./components/credentials-list";
import { BookingBand } from "./components/booking-band";

/**
 * About (`/about`) — the coach's personal story page. A tall editorial hero,
 * two paragraphs of narrative, the three-column "My Approach" philosophy, a
 * credentials list, and a closing invitation to book. Static marketing page —
 * always populated, no empty state. The shared `SiteHeader` gives the "About"
 * nav link its active treatment automatically (NavLink `isActive`).
 */
export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <AboutHero />
        <StorySection />
        <ApproachColumns />
        <CredentialsList />
        <BookingBand />
      </main>

      <SiteFooter />
    </div>
  );
}
