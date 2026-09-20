import { IconLayoutGrid, IconPlus } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * First-time state for Programs Admin: static skeleton bars behind a floating
 * card. The only next step is adding a program, so the CTA opens the add modal.
 */
export function ProgramsBlankslate({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="relative">
      {/* Decorative skeleton bars — non-interactive, hidden from AT. */}
      <div
        aria-hidden="true"
        className="pointer-events-none space-y-3 opacity-60"
      >
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10">
        <Card className="pointer-events-auto flex max-w-sm flex-col items-center gap-4 !shadow-lg px-8 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <IconLayoutGrid className="size-6 text-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              No programs yet
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              Add your first program to show visitors how you can help them.
            </p>
          </div>
          <Button
            onClick={onAdd}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <IconPlus className="size-4" />
            Add your first program
          </Button>
        </Card>
      </div>
    </div>
  );
}
