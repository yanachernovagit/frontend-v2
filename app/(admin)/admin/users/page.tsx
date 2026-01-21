"use client";

import { useState } from "react";

import { DataTable } from "@/components/admin/DataTable";
import { UserFormModal } from "@/components/admin/users/UserFormModal";
import { Badge } from "@/components/ui/badge";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { AdminUser } from "@/types";
import { USER_ROLES } from "@/constants/UserRoles";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUsersPage() {
  const { users, loading, updateUserRole } = useAdminUsers();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: "email", label: "Email" },
    { key: "fullName", label: "Nombre" },
    {
      key: "role",
      label: "Rol",
      render: (item: AdminUser) =>
        item.role === USER_ROLES.ADMIN ? (
          <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold">
            Admin
          </Badge>
        ) : (
          <Badge className="bg-gray-200 text-gray-500 border border-gray-300 font-semibold">
            Usuario
          </Badge>
        ),
    },
    {
      key: "createdAt",
      label: "Creado",
      render: (item: AdminUser) => (
        <span className="text-sm text-gray-600">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
    {
      key: "lastSignInAt",
      label: "Último acceso",
      render: (item: AdminUser) => (
        <span className="text-sm text-gray-600">
          {formatDateTime(item.lastSignInAt)}
        </span>
      ),
    },
  ];

  const handleEdit = (item: AdminUser) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: { role: string }) => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await updateUserRole(selectedItem.id, data.role);
      setFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        onEdit={handleEdit}
        searchKey="email"
        title="Usuarios"
        isLoading={loading}
      />

      <UserFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
        isLoading={isSubmitting}
      />
    </>
  );
}
