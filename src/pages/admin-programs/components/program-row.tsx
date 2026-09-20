import {
  IconDotsVertical,
  IconGripVertical,
  IconToggleLeft,
  IconToggleRight,
} from "@tabler/icons-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/base/badge";
import { cn } from "@/lib/utils";
import type { Program } from "@/lib/data-provider";

/**
 * One program in the admin list: drag handle (fades in on row hover), name,
 * duration + status badges, an Edit button, and an overflow menu whose only
 * action is activate/deactivate — programs are never hard-deleted.
 */
export function ProgramRow({
  program,
  onEdit,
  onToggleActive,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  program: Program;
  onEdit: (program: Program) => void;
  onToggleActive: (program: Program) => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver?: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  return (
    <TableRow
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      className={cn("group", isDragging && "opacity-50")}
    >
      <TableCell className="w-8 cursor-grab pr-0 text-muted-foreground active:cursor-grabbing">
        <IconGripVertical className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </TableCell>
      <TableCell className="font-medium text-foreground">
        {program.name}
      </TableCell>
      <TableCell>
        <Badge color="gray">{program.duration_label}</Badge>
      </TableCell>
      <TableCell>
        <Badge color={program.is_active ? "green" : "gray"}>
          {program.is_active ? "active" : "inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(program)}>
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={`More actions for ${program.name}`}
              >
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleActive(program)}>
                {program.is_active ? (
                  <>
                    <IconToggleLeft className="size-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <IconToggleRight className="size-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
