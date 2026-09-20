import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { AdminPage } from "@/components/admin-page";
import { useDataProvider, type Program } from "@/lib/data-provider";
import { ProgramsTable } from "./components/programs-table";
import { ProgramsBlankslate } from "./components/programs-blankslate";
import { ProgramModal, type ProgramFormValues } from "./components/program-modal";

/**
 * Programs Admin (`/admin/programs`) — the coach manages the programs shown on
 * the public site: add, edit, reorder (drag-and-drop), and activate/deactivate.
 * No hard delete — deactivating preserves booking references.
 */
export default function AdminPrograms() {
  const {
    usePrograms,
    useCreateProgram,
    useUpdateProgram,
    useReorderPrograms,
  } = useDataProvider();

  const { data: programs } = usePrograms();
  const { mutate: createProgram, isPending: isCreating } = useCreateProgram();
  const { mutate: updateProgram, isPending: isUpdating } = useUpdateProgram();
  const { mutate: reorderPrograms } = useReorderPrograms();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (program: Program) => {
    setEditing(program);
    setModalOpen(true);
  };

  const handleSubmit = (values: ProgramFormValues) => {
    if (editing) {
      updateProgram({ id: editing.id, ...values });
    } else {
      createProgram(values);
    }
    setModalOpen(false);
  };

  const handleToggleActive = (program: Program) => {
    updateProgram({ id: program.id, is_active: !program.is_active });
  };

  const isEmpty = programs.length === 0;

  return (
    <AdminPage
      title="Programs"
      description="The ways to work together shown on your site."
      actions={
        <Button variant="outline" onClick={openAdd}>
          <IconPlus className="size-4" />
          Add program
        </Button>
      }
    >
      {isEmpty ? (
        <ProgramsBlankslate onAdd={openAdd} />
      ) : (
        <ProgramsTable
          programs={programs}
          onEdit={openEdit}
          onToggleActive={handleToggleActive}
          onReorder={reorderPrograms}
        />
      )}

      <ProgramModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        program={editing}
        onSubmit={handleSubmit}
        isPending={editing ? isUpdating : isCreating}
      />
    </AdminPage>
  );
}
