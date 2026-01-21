"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { QuestionFormModal } from "@/components/admin/questions/QuestionFormModal";
import { Badge } from "@/components/ui/badge";
import { useAdminQuestions } from "@/hooks/useAdminQuestions";
import { ProfileQuestion } from "@/types";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminQuestionsPage() {
  const { questions, loading, createQuestion, updateQuestion, deleteQuestion } =
    useAdminQuestions();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProfileQuestion | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: "order", label: "Orden" },
    { key: "step", label: "Paso" },
    { key: "title", label: "Título" },
    { key: "type", label: "Tipo" },
    {
      key: "options",
      label: "Opciones",
      render: (item: ProfileQuestion) => (
        <span className="text-sm text-gray-600">
          {item.options?.length || 0}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Activa",
      render: (item: ProfileQuestion) =>
        item.isActive ? (
          <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 font-semibold">
            Sí
          </Badge>
        ) : (
          <Badge className="bg-gray-200 text-gray-500 border border-gray-300 font-semibold">
            No
          </Badge>
        ),
    },
    {
      key: "isRequired",
      label: "Requerida",
      render: (item: ProfileQuestion) =>
        item.isRequired ? (
          <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold">
            Sí
          </Badge>
        ) : (
          <Badge className="bg-gray-200 text-gray-500 border border-gray-300 font-semibold">
            No
          </Badge>
        ),
    },
    {
      key: "dependsOnQuestionId",
      label: "Dependencia",
      render: (item: ProfileQuestion) =>
        item.dependsOnQuestionId ? (
          <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold">
            <Link2 className="w-3 h-3 mr-1" />
            Sí
          </Badge>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        ),
    },
    {
      key: "createdAt",
      label: "Creado",
      render: (item: ProfileQuestion) => (
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

  const handleEdit = (item: ProfileQuestion) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: ProfileQuestion) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: Partial<ProfileQuestion>) => {
    setIsSubmitting(true);
    try {
      if (selectedItem) {
        await updateQuestion(selectedItem.id, data);
      } else {
        await createQuestion(data);
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
      await deleteQuestion(selectedItem.id);
      setDeleteOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={questions}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        searchKey="title"
        title="Preguntas"
        isLoading={loading}
      />

      <QuestionFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
        questions={questions}
        isLoading={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar pregunta"
        description={`¿Estás seguro de que deseas eliminar "${selectedItem?.title}"? Esta acción no se puede deshacer.`}
        isLoading={isSubmitting}
      />
    </>
  );
}
