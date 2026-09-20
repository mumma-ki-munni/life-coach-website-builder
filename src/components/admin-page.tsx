import type { ReactNode } from "react";

interface AdminPageProps {
  /** Screen title — rendered as the page's single `<h1>`. */
  title: string;
  /** Optional one-line subtitle under the title. */
  description?: string;
  /** Optional right-aligned header action(s), e.g. an "Add" button. */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Shared shell for every `/admin/*` (and `/demo/admin/*`) screen. It owns the
 * one thing the four admin screens must agree on: a single centered column
 * width, one heading treatment, an optional description + right-aligned action
 * slot, and a consistent gap before the screen's body. Screens pass only their
 * content — the container, heading, and rhythm live here so the screens can't
 * drift apart again.
 */
export function AdminPage({
  title,
  description,
  actions,
  children,
}: AdminPageProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
