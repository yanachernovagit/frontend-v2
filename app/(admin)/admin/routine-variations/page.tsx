"use client";

import { useState } from "react";

import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { RoutineVariationFormModal } from "@/components/admin/routine-variations/RoutineVariationFormModal";
import { RoutineVariationsTable } from "@/components/admin/routine-variations/RoutineVariationsTable";
import { useAdminRoutineVariations } from "@/hooks/useAdminRoutineVariations";
import { useAdminRoutines } from "@/hooks/useAdminRoutines";
import { useAdminExercises } from "@/hooks/useAdminExercises";
import { RoutineVariation, CreateRoutineVariationPayload } from "@/types";

export default function AdminRoutineVariationsPage() {
  const {
    variations,
    loading,
    error,
    createVariation,
    updateVariation,
    deleteVariation,
  } = useAdminRoutineVariations();

  const { routines: routineCatalogs } = useAdminRoutines();
  const { exercises: exerciseCatalogs } = useAdminExercises();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RoutineVariation | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: RoutineVariation) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: RoutineVariation) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: CreateRoutineVariationPayload) => {
    setIsSubmitting(true);
    try {
      if (selectedItem) {
        await updateVariation(selectedItem.id, data);
      } else {
        await createVariation(data);
      }
      setFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await deleteVariation(selectedItem.id);
      setDeleteOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <RoutineVariationsTable
        data={variations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={loading}
      />

      <RoutineVariationFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
        isLoading={isSubmitting}
        routineCatalogs={routineCatalogs}
        exerciseCatalogs={exerciseCatalogs}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar variación de rutina"
        description={`¿Estás seguro de que deseas eliminar "${selectedItem?.name}"? Esta acción no se puede deshacer.`}
        isLoading={isSubmitting}
      />
    </>
  );
}
