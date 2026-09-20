import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Reveal — element-level scroll reveal, a React port of Squarespace Fluid's
 * page-wide stagger (site-bundle + live myhra-fluid-demo DOM).
 *
 * Fluid tags every animatable element (h1–h4, p, images, buttons, cards) with a
 * `preFade` class + inline `transition-delay = index × (animation-delay ÷ count)`
 * in document order, then adds `fadeIn` (opacity 0→1) when it enters the
 * viewport. We reproduce that: each Reveal fades in on scroll-into-view, and an
 * `order` prop stamps the document-order delay so siblings cascade.
 *
 * Reverse-engineered feel: Fluid's demo uses `ease`, 0.9s, and a ~9ms step
 * (0.6s ÷ 66 elements) — so subtle it reads as near-simultaneous. We keep the
 * fade but use the nicer Squarespace expo curve and a visible ~90ms step so the
 * cascade is felt, and add an optional gentle rise. Honors reduced-motion.
 */

const EASING = "cubic-bezier(0.19, 1, 0.22, 1)"; // Squarespace easeOutExpo
const DURATION = "0.9s"; // matches Squarespace Fluid's animation-duration
const STEP_MS = 90; // per-order stagger step (Fluid's is ~9ms; we make it felt)
const RISE_PX = 18;

type RevealVariant = "rise" | "fade";

interface RevealProps {
  children: ReactNode;
  /** Element to render as — "div", "p", "li", "span", … (default "div"). */
  as?: ElementType;
  className?: string;
  /** Document-order position within its group; drives the stagger delay. */
  order?: number;
  /** "fade" = opacity only (default, Fluid-exact); "rise" = fade + upward drift. */
  variant?: RevealVariant;
}

export function Reveal({
  children,
  as = "div",
  className,
  order = 0,
  variant = "fade",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [fired, setFired] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    observerRef.current.observe(node);
  }, [reducedMotion]);

  useEffect(() => {
    observe();
    return () => observerRef.current?.disconnect();
  }, [observe]);

  if (reducedMotion) {
    return createElement(as, { className, ref }, children);
  }

  const hidden = !fired;
  const style: CSSProperties = {
    opacity: hidden ? 0 : 1,
    transform:
      variant === "rise" && hidden ? `translateY(${RISE_PX}px)` : "translateY(0)",
    transitionProperty: "opacity, transform",
    transitionDuration: DURATION,
    transitionTimingFunction: EASING,
    transitionDelay: `${order * STEP_MS}ms`,
    willChange: "opacity, transform",
  };

  return createElement(as, { className, ref, style }, children);
}
