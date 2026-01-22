"use client";

import { useMemo, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { RenameMediaDialog } from "@/components/admin/media/RenameMediaDialog";
import { useAdminMedia } from "@/hooks/useAdminMedia";
import { MediaAsset, MediaAssociation } from "@/types";

const entityLabels: Record<MediaAssociation["entity"], string> = {
  evaluation: "Evaluación",
  exercise: "Ejercicio",
  routine: "Rutina",
};

const entityStyles: Record<MediaAssociation["entity"], string> = {
  evaluation: "bg-purple/10 text-purple border-purple/30",
  exercise: "bg-magent/10 text-magent border-magent/30",
  routine: "bg-blue/10 text-blue border-blue/30",
};

function formatBytes(size?: number) {
  if (!size) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminMediaPage() {
  const { assets, loading, error, refetch, renameAsset, deleteAsset } =
    useAdminMedia();
  const [selectedItem, setSelectedItem] = useState<MediaAsset | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = useMemo(() => {
    const used = assets.filter((asset) => asset.associations.length > 0).length;
    return {
      total: assets.length,
      used,
      orphan: assets.length - used,
    };
  }, [assets]);

  const columns = [
    {
      key: "key",
      label: "Archivo",
      render: (item: MediaAsset) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 break-all">
              {item.key}
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="text-purple hover:text-purple/70"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <span className="text-xs text-gray-400 break-all">{item.url}</span>
        </div>
      ),
    },
    {
      key: "size",
      label: "Tamaño",
      render: (item: MediaAsset) => (
        <span className="text-sm text-gray-600">{formatBytes(item.size)}</span>
      ),
    },
    {
      key: "lastModified",
      label: "Última modificación",
      render: (item: MediaAsset) => (
        <span className="text-sm text-gray-600">
          {formatDate(item.lastModified)}
        </span>
      ),
    },
    {
      key: "associations",
      label: "Asociaciones",
      sortable: false,
      render: (item: MediaAsset) => (
        <div className="flex flex-wrap gap-2">
          {item.associations.length === 0 ? (
            <Badge className="bg-gray-100 text-gray-500 border-gray-200">
              Sin uso
            </Badge>
          ) : (
            item.associations.map((association) => (
              <Badge
                key={`${association.entity}-${association.id}-${association.field}`}
                className={entityStyles[association.entity]}
              >
                {entityLabels[association.entity]} · {association.label} ·{" "}
                {association.field}
              </Badge>
            ))
          )}
        </div>
      ),
    },
  ];

  const handleRename = (item: MediaAsset) => {
    setSelectedItem(item);
    setRenameValue(item.key.split("/").pop() ?? item.key);
    setActionError(null);
    setRenameOpen(true);
  };

  const handleDelete = (item: MediaAsset) => {
    setSelectedItem(item);
    setActionError(null);
    setDeleteOpen(true);
  };

  const handleRenameConfirm = async () => {
    if (!selectedItem) return;
    const nextName = renameValue.trim();
    if (!nextName) {
      setActionError("El nombre no puede estar vacío.");
      return;
    }

    setIsSubmitting(true);
    try {
      await renameAsset(selectedItem.key, nextName);
      setRenameOpen(false);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "No se pudo renombrar el archivo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await deleteAsset(selectedItem.key);
      setDeleteOpen(false);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el archivo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-purple/10 text-purple border-purple/30">
            Total: {summary.total}
          </Badge>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            En uso: {summary.used}
          </Badge>
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            Sin uso: {summary.orphan}
          </Badge>
          {(error || actionError) && (
            <span className="text-sm text-red-500">{error || actionError}</span>
          )}
        </div>
        <Button
          type="button"
          variant="outline_magent"
          onClick={refetch}
          disabled={loading}
          className="h-10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {loading ? "Actualizando..." : "Refrescar"}
        </Button>
      </div>

      <DataTable
        data={assets}
        columns={columns}
        onEdit={handleRename}
        onDelete={handleDelete}
        searchKey="key"
        title="Multimedia"
        isLoading={loading}
      />

      <RenameMediaDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        currentKey={selectedItem?.key}
        value={renameValue}
        onChange={setRenameValue}
        onConfirm={handleRenameConfirm}
        isLoading={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar archivo"
        description={`¿Seguro que deseas eliminar \"${selectedItem?.key ?? ""}\"?`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
