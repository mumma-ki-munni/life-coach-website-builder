import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import type { Program } from "@/lib/data-provider";
import { ProgramRow } from "./program-row";

/**
 * The programs list. Rows are drag-reorderable via native HTML5 drag-and-drop:
 * dropping a dragged row onto another splices it into that position and hands
 * the full reordered array to `onReorder`, which persists `display_order`
 * optimistically. No search, filter, or pagination — at 3–10 programs a visual
 * scan is enough.
 */
export function ProgramsTable({
  programs,
  onEdit,
  onToggleActive,
  onReorder,
}: {
  programs: Program[];
  onEdit: (program: Program) => void;
  onToggleActive: (program: Program) => void;
  onReorder: (ordered: Program[]) => void;
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    const fromIndex = programs.findIndex((p) => p.id === draggedId);
    const toIndex = programs.findIndex((p) => p.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...programs];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    setDraggedId(null);
    onReorder(next);
  };

  return (
    <div className="rounded-lg border border-solid">
      <Table>
        <TableBody>
          {programs.map((program) => (
            <ProgramRow
              key={program.id}
              program={program}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              isDragging={draggedId === program.id}
              onDragStart={() => setDraggedId(program.id)}
              onDrop={() => handleDrop(program.id)}
              onDragEnd={() => setDraggedId(null)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
