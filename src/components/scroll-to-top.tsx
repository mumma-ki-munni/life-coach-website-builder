import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll to top on pathname change so navigating between routes
 * (especially via footer links from the bottom of a page) lands at the top
 * instead of retaining the previous page's scroll position.
 *
 * Skips hash navigation so in-page anchor links keep working.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
