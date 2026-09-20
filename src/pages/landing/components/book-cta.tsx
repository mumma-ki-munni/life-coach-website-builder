import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookCtaProps {
  /** Button label. The one CTA across the whole site points at `/book`. */
  label?: string;
  size?: "default" | "lg";
  className?: string;
}

/**
 * The single site-wide call to action — a solid black, sharp-edged button that
 * always books the free intake call (`/book`). Reused in the hero, the second
 * editorial band, and the closing consultation band.
 */
export function BookCta({
  label = "Book a free intake call",
  size = "lg",
  className,
}: BookCtaProps) {
  return (
    <Button
      asChild
      size={size}
      className={cn(
        "rounded-none uppercase tracking-[0.12em] font-medium",
        className,
      )}
    >
      <Link to="/book">
        {label}
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  );
}
