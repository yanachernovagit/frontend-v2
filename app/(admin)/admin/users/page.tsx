"use client";

import { useState } from "react";

import { DataTable } from "@/components/admin/DataTable";
import { UserDetailModal } from "@/components/admin/users/UserDetailModal";
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
  const {
    users,
    loading,
    error,
    updateUserRole,
    userDetail,
    detailLoading,
    fetchUserDetail,
    clearUserDetail,
    updateUserPlan,
    resetPassword,
    sendResetEmail,
    resetPlan,
    deletePrescriptionCache,
    refetch,
    // New actions
    createPlan,
    updateTasks,
    setFatigue,
    updatePlanDetails,
    toggleDebug,
    prescriptions,
    prescriptionsLoading,
    fetchPrescriptions,
  } = useAdminUsers();

  const [detailOpen, setDetailOpen] = useState(false);

  const columns = [
    { key: "email", label: "Email" },
    { key: "fullName", label: "Nombre" },
    {
      key: "role",
      label: "Rol",
      render: (item: AdminUser) => (
        <div className="flex items-center gap-1.5">
          {item.role === USER_ROLES.ADMIN ? (
            <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold">
              Admin
            </Badge>
          ) : (
            <Badge className="bg-gray-200 text-gray-500 border border-gray-300 font-semibold">
              Usuario
            </Badge>
          )}
          {item.debug && (
            <Badge className="bg-amber-100 text-amber-700 border border-amber-300 font-semibold text-[10px] px-1.5 py-0">
              DEBUG
            </Badge>
          )}
        </div>
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
      label: "Ultimo acceso",
      render: (item: AdminUser) => (
        <span className="text-sm text-gray-600">
          {formatDateTime(item.lastSignInAt)}
        </span>
      ),
    },
  ];

  const handleEdit = async (item: AdminUser) => {
    setDetailOpen(true);
    await fetchUserDetail(item.id);
  };

  const handleDetailClose = (open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      clearUserDetail();
      // Refresh the list in case something changed
      refetch();
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    await updateUserRole(id, role);
    // Also refresh detail
    await fetchUserDetail(id);
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
        error={error}
      />

      <UserDetailModal
        open={detailOpen}
        onOpenChange={handleDetailClose}
        user={userDetail}
        loading={detailLoading}
        onUpdateRole={handleUpdateRole}
        onUpdatePlan={updateUserPlan}
        onResetPassword={resetPassword}
        onSendResetEmail={sendResetEmail}
        onResetPlan={resetPlan}
        onDeletePrescriptionCache={deletePrescriptionCache}
        onCreatePlan={createPlan}
        onUpdateTasks={updateTasks}
        onSetFatigue={setFatigue}
        onUpdatePlanDetails={updatePlanDetails}
        onToggleDebug={toggleDebug}
        prescriptions={prescriptions}
        prescriptionsLoading={prescriptionsLoading}
        onFetchPrescriptions={fetchPrescriptions}
      />
    </>
  );
}
