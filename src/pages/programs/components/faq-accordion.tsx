import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { SegmentedText } from "@/lib/animations/segmented-text";
import { Reveal } from "@/lib/animations/reveal";

interface Faq {
  question: string;
  answer: string;
}

// Static marketing copy — five questions don't need filtering and there is no
// DataProvider hook for them, so the verbatim seed answers live here as page
// content the coach edits in Lovable.
const FAQS: Faq[] = [
  {
    question: "How does coaching actually work?",
    answer:
      "We meet one-on-one via video, once a week or every two weeks. Each session is 50 minutes. I ask questions, you think out loud, and together we figure out what's next.",
  },
  {
    question: "How long are the programs?",
    answer:
      "Programs run 8–12 weeks depending on the focus area. The intake call helps us agree on the right fit before you commit to anything.",
  },
  {
    question: "Is the intake call really free?",
    answer:
      "Yes — completely. No credit card, no obligation. It's a real conversation to see if working together makes sense for both of us.",
  },
  {
    question: "What happens if we're not a fit?",
    answer:
      "I'll tell you honestly and, where I can, point you toward something that might help more. Finding the right support matters more than filling a spot.",
  },
  {
    question: "How do we meet — video or in person?",
    answer:
      "All sessions are via video call (Zoom or Google Meet). This means we can work together regardless of where you're based.",
  },
];

/**
 * FAQ accordion. Five items, all collapsed initially, expanding in place. The
 * disclosure chevron points right when collapsed and rotates to point down when
 * the item is open. No search — five questions don't need filtering.
 */
export function FaqAccordion() {
  return (
    <section className="theme-blush border-t border-border bg-background">
      <div className="mx-auto max-w-page px-6 py-20 lg:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <SegmentedText
              as="h2"
              className="block max-w-[10ch] text-balance font-heading text-4xl font-medium leading-[1.02] tracking-tight text-foreground lg:text-5xl"
            >
              Questions, answered
            </SegmentedText>
          </div>

          <Accordion
            type="single"
            collapsible
            className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0"
          >
            {FAQS.map((faq, i) => (
              <Reveal key={faq.question} order={i}>
                <AccordionItem
                  value={faq.question}
                  className="border-b border-border"
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 items-start justify-between gap-6 py-7 text-left font-heading text-2xl font-medium leading-tight tracking-tight text-foreground transition-opacity hover:opacity-70 lg:text-3xl">
                      {faq.question}
                      <Plus className="mt-1 size-6 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45" />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className="max-w-2xl pb-7 text-pretty text-lg leading-relaxed text-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
