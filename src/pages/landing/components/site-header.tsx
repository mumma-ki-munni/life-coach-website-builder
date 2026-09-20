import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
}

// Matches the five public pages exactly — no utility links (FAQ, pricing, blog).
const NAV_ITEMS: NavItem[] = [
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Book", to: "/book" },
  { label: "Contact", to: "/contact" },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="font-heading text-lg font-semibold tracking-tight text-foreground"
    >
      Life Coach
    </Link>
  );
}

/**
 * Sticky marketing nav: wordmark left, page links center-right, a quiet
 * "Sign in" text link, and the one solid-black "Book →" CTA far right. Collapses
 * to a burger + slide-down drawer below `lg`.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-6 lg:px-8">
        <Wordmark />

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm transition-colors hover:text-foreground",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Button
            asChild
            className="rounded-none uppercase tracking-[0.12em] font-medium"
          >
            <Link to="/book">
              Book
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile burger + drawer */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-8 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={({ isActive }) =>
                      cn(
                        "py-2 text-base transition-colors hover:text-foreground",
                        isActive
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Button
                  asChild
                  className="mt-4 rounded-none uppercase tracking-[0.12em] font-medium"
                >
                  <Link to="/book" onClick={close}>
                    Book a free intake call
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
