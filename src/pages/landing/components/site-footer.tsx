import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Book", to: "/book" },
  { label: "Contact", to: "/contact" },
];

/**
 * Plain footer: wordmark left, page links right. No newsletter, no social
 * links, no copyright row — the coach adds those in Lovable if wanted.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Life Coach
        </span>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/sign-in"
            className="text-sm text-muted-foreground/70 transition-colors hover:text-foreground"
          >
            Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}
