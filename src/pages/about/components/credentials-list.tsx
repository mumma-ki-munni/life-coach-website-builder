import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

// Static read-only metadata. No DataProvider hook exists for credentials, so the
// verbatim seed copy lives here as page content.
const CREDENTIALS: string[] = [
  "ICF Certified Professional Coach (PCC)",
  "Trained at the Co-Active Training Institute",
  "200+ clients coached since 2018",
  "7 years in practice",
];

/**
 * "Credentials" — an oversized display heading paired with the credentials as a
 * large editorial list (hairline dividers, Fraunces type) dropped alongside it.
 * On a blush ground. Same scale contrast as the Home page's editorial bands.
 */
export function CredentialsList() {
  return (
    <section className="theme-blush overflow-hidden border-t border-border bg-background">
      <div className="mx-auto max-w-page px-6 py-20 lg:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
          <SegmentedText
            as="h2"
            baseDelayMs={120}
            className="block max-w-[9ch] text-balance font-heading text-5xl font-medium leading-[0.98] tracking-tight text-foreground lg:col-span-5 lg:text-7xl"
          >
            Trained for this.
          </SegmentedText>

          <ul className="mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
            {CREDENTIALS.map((text, i) => (
              <Reveal
                as="li"
                key={text}
                order={1 + i}
                className="border-t border-border py-6 first:border-t-0 first:pt-0"
              >
                <span className="font-heading text-xl font-medium leading-snug tracking-tight text-foreground lg:text-2xl">
                  {text}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
