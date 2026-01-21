"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { RoutineFormModal } from "@/components/admin/routines/RoutineFormModal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminRoutines } from "@/hooks/useAdminRoutines";
import { RoutineCatalog } from "@/types";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminRoutinesPage() {
  const { routines, loading, createRoutine, updateRoutine, deleteRoutine } =
    useAdminRoutines();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RoutineCatalog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const columns = [
    { key: "order", label: "Orden" },
    { key: "title", label: "Título" },
    {
      key: "iconUrl",
      label: "Icono",
      sortable: false,
      render: (item: RoutineCatalog) =>
        item.iconUrl ? (
          <button
            onClick={() => setPreviewImage(item.iconUrl!)}
            className="w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple transition-all bg-white border border-gray-200"
          >
            <img
              src={item.iconUrl}
              alt={`Icono de ${item.title}`}
              className="w-full h-full object-contain p-1"
            />
          </button>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
        ),
    },
    {
      key: "createdAt",
      label: "Creado",
      render: (item: RoutineCatalog) => (
        <span className="text-sm text-gray-600">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
  ];

  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: RoutineCatalog) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: RoutineCatalog) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: Partial<RoutineCatalog>) => {
    setIsSubmitting(true);
    try {
      if (selectedItem) {
        await updateRoutine(selectedItem.id, data);
      } else {
        await createRoutine(data as Omit<RoutineCatalog, "id">);
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
      await deleteRoutine(selectedItem.id);
      setDeleteOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={routines}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        searchKey="title"
        title="Rutinas"
        isLoading={loading}
      />

      <RoutineFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
        isLoading={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar rutina"
        description={`¿Estás seguro de que deseas eliminar "${selectedItem?.title}"? Esta acción no se puede deshacer.`}
        isLoading={isSubmitting}
      />

      {/* Modal para preview de imagen */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-md p-4">
          <DialogTitle className="sr-only">Preview de icono</DialogTitle>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
