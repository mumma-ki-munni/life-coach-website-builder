import { useEffect, useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Program } from "@/lib/data-provider";

export interface ProgramFormValues {
  name: string;
  who_its_for: string;
  description: string[];
  duration_label: string;
}

interface FieldErrors {
  name?: string;
  who_its_for?: string;
  description?: string;
  duration_label?: string;
}

/**
 * Add / edit program dialog. Same component for both flows — the title and the
 * initial field values switch on whether a `program` is passed. Four required
 * fields; "What we cover" is one bullet per line, split to a string[] on save.
 */
export function ProgramModal({
  open,
  onOpenChange,
  program,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program | null;
  onSubmit: (values: ProgramFormValues) => void;
  isPending: boolean;
}) {
  const isEdit = program !== null;

  const [name, setName] = useState("");
  const [whoItsFor, setWhoItsFor] = useState("");
  const [cover, setCover] = useState("");
  const [duration, setDuration] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  // Seed the fields whenever the dialog opens — pre-filled for edit, empty for
  // add. Reset happens on open (not close) to avoid a flash of empty fields
  // during the close animation.
  useEffect(() => {
    if (!open) return;
    setName(program?.name ?? "");
    setWhoItsFor(program?.who_its_for ?? "");
    setCover(program ? program.description.join("\n") : "");
    setDuration(program?.duration_label ?? "");
    setErrors({});
  }, [open, program]);

  const handleSubmit = () => {
    const coverLines = cover
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const nextErrors: FieldErrors = {};
    if (!name.trim()) nextErrors.name = "Program name is required.";
    if (!whoItsFor.trim())
      nextErrors.who_its_for = "Tell visitors who this is for.";
    if (coverLines.length === 0)
      nextErrors.description = "Add at least one thing you cover.";
    if (!duration.trim())
      nextErrors.duration_label = "Add a duration, e.g. “12 weeks”.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      name: name.trim(),
      who_its_for: whoItsFor.trim(),
      description: coverLines,
      duration_label: duration.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit program" : "Add program"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="program-name">Program name *</Label>
            <Input
              id="program-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Career Clarity"
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="program-who">Who is this for? *</Label>
            <Textarea
              id="program-who"
              rows={2}
              value={whoItsFor}
              onChange={(e) => setWhoItsFor(e.target.value)}
              placeholder="For professionals who've outgrown their current path but can't see what comes next."
              className={cn(errors.who_its_for && "border-destructive")}
            />
            {errors.who_its_for && (
              <p className="text-sm text-destructive">{errors.who_its_for}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="program-cover">
              What we cover (one item per line) *
            </Label>
            <Textarea
              id="program-cover"
              rows={3}
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder={
                "Values alignment & what you actually want from your work life\nIdentifying what's been holding you back\nBuilding a concrete plan for what comes next"
              }
              className={cn(errors.description && "border-destructive")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="program-duration">Duration *</Label>
            <Input
              id="program-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="12 weeks"
              className={cn(errors.duration_label && "border-destructive")}
            />
            {errors.duration_label && (
              <p className="text-sm text-destructive">
                {errors.duration_label}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <IconLoader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              "SAVE PROGRAM"
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
