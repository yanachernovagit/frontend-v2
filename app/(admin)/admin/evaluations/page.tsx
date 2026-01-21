"use client";

import { useState } from "react";
import { Clock, Edit, Play, ImageIcon } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { EvaluationFormModal } from "@/components/admin/evaluations/EvaluationFormModal";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminEvaluations } from "@/hooks/useAdminEvaluations";
import { Evaluation } from "@/types";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminEvaluationsPage() {
  const {
    evaluations,
    loading,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
  } = useAdminEvaluations();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Evaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const columns = [
    { key: "order", label: "Orden" },
    { key: "name", label: "Nombre" },
    {
      key: "isTime",
      label: "Tipo",
      render: (item: Evaluation) =>
        item.isTime ? (
          <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold">
            <Clock className="w-3 h-3 mr-1" />
            Tiempo
          </Badge>
        ) : (
          <Badge className="bg-magent/10 text-magent border border-magent/20 font-semibold">
            <Edit className="w-3 h-3 mr-1" />
            Medición
          </Badge>
        ),
    },
    {
      key: "seconds",
      label: "Duración",
      render: (item: Evaluation) =>
        item.isTime && item.seconds
          ? `${Math.floor(item.seconds / 60)}:${String(
              item.seconds % 60,
            ).padStart(2, "0")}`
          : "-",
    },
    {
      key: "imageUrl",
      label: "Imagen",
      sortable: false,
      render: (item: Evaluation) =>
        item.imageUrl ? (
          <button
            onClick={() => setPreviewImage(item.imageUrl!)}
            className="w-16 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
          >
            <img
              src={item.imageUrl}
              alt={`Imagen de ${item.name}`}
              className="w-full h-full object-cover"
            />
          </button>
        ) : (
          <div className="w-16 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
        ),
    },
    {
      key: "logoUrl",
      label: "Logo",
      sortable: false,
      render: (item: Evaluation) =>
        item.logoUrl ? (
          <button
            onClick={() => setPreviewImage(item.logoUrl!)}
            className="w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
          >
            <img
              src={item.logoUrl}
              alt={`Logo de ${item.name}`}
              className="w-full h-full object-cover"
            />
          </button>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
        ),
    },
    {
      key: "videoUrl",
      label: "Video",
      sortable: false,
      render: (item: Evaluation) =>
        item.videoUrl ? (
          <button
            onClick={() => setPreviewVideo(item.videoUrl!)}
            className="relative group w-16 h-12 rounded-lg overflow-hidden bg-gray-900 hover:ring-2 hover:ring-purple transition-all"
          >
            <video
              src={item.videoUrl}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3 h-3 text-purple fill-purple ml-0.5" />
              </div>
            </div>
          </button>
        ) : (
          <Badge className="bg-gray-200 text-gray-500 border border-gray-300 font-semibold">
            Sin video
          </Badge>
        ),
    },
    {
      key: "createdAt",
      label: "Creado",
      render: (item: Evaluation) => (
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

  const handleEdit = (item: Evaluation) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: Evaluation) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Evaluation>) => {
    setIsSubmitting(true);
    try {
      if (selectedItem) {
        await updateEvaluation(selectedItem.id, data);
      } else {
        await createEvaluation(
          data as Omit<Evaluation, "id" | "createdAt" | "updatedAt">,
        );
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
      await deleteEvaluation(selectedItem.id);
      setDeleteOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={evaluations}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        searchKey="name"
        title="Evaluaciones"
        isLoading={loading}
      />

      <EvaluationFormModal
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
        title="Eliminar evaluación"
        description={`¿Estás seguro de que deseas eliminar "${selectedItem?.name}"? Esta acción no se puede deshacer.`}
        isLoading={isSubmitting}
      />

      {/* Modal para preview de imagen */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">Preview de imagen</DialogTitle>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para preview de video */}
      <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
        <DialogContent className="max-w-4xl p-2">
          <DialogTitle className="sr-only">Preview de video</DialogTitle>
          {previewVideo && (
            <video
              src={previewVideo}
              controls
              autoPlay
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
