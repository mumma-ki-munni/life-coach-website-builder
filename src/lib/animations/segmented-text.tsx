import {
  createElement,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Segmented-text reveal — a faithful React port of Squarespace's "flex"
 * scroll animation (site-bundle module 28408).
 *
 * On scroll-into-view the text is split into words; each word sits inside an
 * `overflow: hidden` mask and rises from below the clip line, cascading
 * left-to-right. Reverse-engineered values, kept verbatim:
 *   - duration            0.6s
 *   - easing              cubic-bezier(0.19, 1, 0.22, 1)   (easeOutExpo)
 *   - per-word stagger    20ms  (transition-delay = 20 * index)
 *   - fires once on enter, via IntersectionObserver
 *
 * Differences from the original (all deliberate): we render real word spans
 * instead of mutating innerHTML, so it's React/SSR-safe and the full text is
 * always in the DOM for screen readers and SEO. Honors prefers-reduced-motion
 * by rendering plain text with no transform.
 */

const DURATION = "0.9s"; // matches Squarespace Fluid's animation-duration
const EASING = "cubic-bezier(0.19, 1, 0.22, 1)";
const STAGGER_MS = 20;

interface SegmentedTextProps {
  children: string;
  /** Element to render as — "h1", "h2", "p", "span", … (default "span"). */
  as?: ElementType;
  className?: string;
  /** Extra delay before the whole line starts (ms). */
  baseDelayMs?: number;
}

export function SegmentedText({
  children,
  as = "span",
  className,
  baseDelayMs = 0,
}: SegmentedTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [fired, setFired] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const words = useMemo(
    () => children.trim().split(/\s+/).filter(Boolean),
    [children],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const observe = useCallback(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setFired(true);
            observerRef.current?.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observerRef.current.observe(node);
  }, [reducedMotion]);

  useEffect(() => {
    observe();
    return () => observerRef.current?.disconnect();
  }, [observe]);

  // Reduced motion (or SR without JS): plain, fully-visible text.
  if (reducedMotion) {
    return createElement(as, { className, ref }, children);
  }

  const maskStyle: CSSProperties = {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "top",
    // Give descenders (g, y, p) room so the clip mask never shaves them.
    paddingBottom: "0.12em",
    marginBottom: "-0.12em",
  };

  const interiorStyle = (index: number): CSSProperties => ({
    display: "inline-block",
    transform: fired ? "translateY(0)" : "translateY(115%)",
    transitionProperty: "transform",
    transitionDuration: DURATION,
    transitionTimingFunction: EASING,
    transitionDelay: `${baseDelayMs + index * STAGGER_MS}ms`,
    willChange: "transform",
  });

  // The inter-word space is a real text node BETWEEN masks (not inside them)
  // so adjacent inline-block masks still offer a line-break opportunity and
  // multi-line headings wrap normally.
  const space = " ";
  const content: ReactNode = words.map((word, i) => (
    <Fragment key={i}>
      <span style={maskStyle}>
        <span style={interiorStyle(i)}>{word}</span>
      </span>
      {i < words.length - 1 ? space : null}
    </Fragment>
  ));

  return createElement(as, { className, ref }, content);
}
