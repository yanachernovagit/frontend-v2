"use client";

import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Activity,
  Key,
  ClipboardList,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Mail,
  Save,
  Check,
  Plus,
  Bug,
  FileText,
  Zap,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { AdminUserDetail, PrescriptionHistoryItem } from "@/types";
import { USER_ROLES } from "@/constants/UserRoles";
import { PHASE_LABELS, PhaseEnum } from "@/constants/enums/phase.enum";
import { STAGE_LABELS, StageEnum } from "@/constants/enums/stage.enum";

type Tab = "info" | "plan" | "account" | "profile" | "prescriptions";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserDetail | null;
  loading: boolean;
  onUpdateRole: (id: string, role: string) => Promise<void>;
  onUpdatePlan: (
    id: string,
    data: { phase?: number; stage?: number },
  ) => Promise<void>;
  onResetPassword: (id: string, newPassword: string) => Promise<void>;
  onSendResetEmail: (id: string) => Promise<void>;
  onResetPlan: (id: string) => Promise<void>;
  onDeletePrescriptionCache: (id: string) => Promise<void>;
  // New props
  onCreatePlan: (id: string, phase: number) => Promise<void>;
  onUpdateTasks: (
    id: string,
    tasks: {
      profileCompleted?: boolean;
      firstEvaluationCompleted?: boolean;
      secondEvaluationCompleted?: boolean;
      dailyPlanCompleted?: boolean;
    },
  ) => Promise<void>;
  onSetFatigue: (id: string, level: number) => Promise<void>;
  onUpdatePlanDetails: (
    id: string,
    data: {
      currentWeek?: number;
      completedToday?: boolean;
      progressRoutine?: number;
      progressExercise?: number;
    },
  ) => Promise<void>;
  onToggleDebug: (id: string, debug: boolean) => Promise<void>;
  prescriptions: PrescriptionHistoryItem[];
  prescriptionsLoading: boolean;
  onFetchPrescriptions: (id: string) => Promise<void>;
}

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

export function UserDetailModal({
  open,
  onOpenChange,
  user,
  loading,
  onUpdateRole,
  onUpdatePlan,
  onResetPassword,
  onSendResetEmail,
  onResetPlan,
  onDeletePrescriptionCache,
  onCreatePlan,
  onUpdateTasks,
  onSetFatigue,
  onUpdatePlanDetails,
  onToggleDebug,
  prescriptions,
  prescriptionsLoading,
  onFetchPrescriptions,
}: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("info");

  // Role
  const [selectedRole, setSelectedRole] = useState("");
  const [roleSubmitting, setRoleSubmitting] = useState(false);

  // Plan
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [planSubmitting, setPlanSubmitting] = useState(false);

  // Create plan
  const [createPlanPhase, setCreatePlanPhase] = useState<string>("0");
  const [createPlanSubmitting, setCreatePlanSubmitting] = useState(false);

  // Plan details editing
  const [editWeek, setEditWeek] = useState<string>("");
  const [editProgressRoutine, setEditProgressRoutine] = useState<string>("");
  const [editProgressExercise, setEditProgressExercise] = useState<string>("");
  const [planDetailsSubmitting, setPlanDetailsSubmitting] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // Tasks
  const [tasksSubmitting, setTasksSubmitting] = useState(false);

  // Fatigue
  const [fatigueLevel, setFatigueLevel] = useState<string>("5");
  const [fatigueSubmitting, setFatigueSubmitting] = useState(false);

  // Debug
  const [debugSubmitting, setDebugSubmitting] = useState(false);

  // Confirmations
  const [confirmResetPlan, setConfirmResetPlan] = useState(false);
  const [confirmDeleteCache, setConfirmDeleteCache] = useState(false);
  const [resetPlanSubmitting, setResetPlanSubmitting] = useState(false);
  const [deleteCacheSubmitting, setDeleteCacheSubmitting] = useState(false);

  // Feedback
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Sync plan details when user ID changes (not on every plan reference change)
  const userId = user?.id;
  const planPhase = user?.plan?.phase;
  const planStage = user?.plan?.stage;
  const planWeek = user?.plan?.currentWeek;
  const planProgressR = user?.plan?.progressRoutine;
  const planProgressE = user?.plan?.progressExercise;

  // Reset all local state when a different user is loaded
  useEffect(() => {
    if (!userId) return;
    setActiveTab("info");
    setSelectedRole(user?.role ?? "user");
    setSelectedPhase(planPhase?.toString() ?? "");
    setSelectedStage(planStage?.toString() ?? "");
    setNewPassword("");
    setConfirmResetPlan(false);
    setConfirmDeleteCache(false);
    setResetPlanSubmitting(false);
    setDeleteCacheSubmitting(false);
    setFeedback(null);
    setFatigueLevel("5");
  }, [userId, user?.role, planPhase, planStage]);

  useEffect(() => {
    if (planWeek !== undefined) {
      setEditWeek(planWeek.toString());
      setEditProgressRoutine((planProgressR ?? 0).toString());
      setEditProgressExercise((planProgressE ?? 0).toString());
    } else {
      setEditWeek("");
      setEditProgressRoutine("");
      setEditProgressExercise("");
    }
  }, [userId, planWeek, planProgressR, planProgressE]);

  // Reset local state when modal opens with new user
  const handleOpenChange = (val: boolean) => {
    if (val && user) {
      setSelectedRole(user.role);
      setSelectedPhase(user.plan?.phase?.toString() ?? "");
      setSelectedStage(user.plan?.stage?.toString() ?? "");
      setNewPassword("");
      setConfirmResetPlan(false);
      setConfirmDeleteCache(false);
      setResetPlanSubmitting(false);
      setDeleteCacheSubmitting(false);
      setFeedback(null);
      setActiveTab("info");
      setFatigueLevel("5");
      // Reset plan detail edit fields
      setEditWeek(user.plan?.currentWeek?.toString() ?? "");
      setEditProgressRoutine(user.plan?.progressRoutine?.toString() ?? "");
      setEditProgressExercise(user.plan?.progressExercise?.toString() ?? "");
    }
    onOpenChange(val);
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-purple/15 shadow-2xl">
          <div className="py-12 text-center text-gray-500">
            Cargando informacion del usuario...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "info", label: "General", icon: User },
    { key: "plan", label: "Plan", icon: Activity },
    { key: "prescriptions", label: "Prescripciones", icon: FileText },
    { key: "account", label: "Cuenta", icon: Key },
    { key: "profile", label: "Perfil", icon: ClipboardList },
  ];

  // ─── Handlers ──────────────────────────────────────────────────

  const handleUpdateRole = async () => {
    if (!selectedRole || selectedRole === user.role) return;
    setRoleSubmitting(true);
    try {
      await onUpdateRole(user.id, selectedRole);
      showFeedback("success", "Rol actualizado correctamente.");
    } catch {
      showFeedback("error", "Error al actualizar el rol.");
    } finally {
      setRoleSubmitting(false);
    }
  };

  const handleToggleDebug = async () => {
    setDebugSubmitting(true);
    try {
      await onToggleDebug(user.id, !user.debug);
      showFeedback(
        "success",
        `Modo debug ${!user.debug ? "activado" : "desactivado"}.`,
      );
    } catch {
      showFeedback("error", "Error al cambiar modo debug.");
    } finally {
      setDebugSubmitting(false);
    }
  };

  const handleUpdatePlan = async () => {
    const data: { phase?: number; stage?: number } = {};
    if (selectedPhase !== "") data.phase = parseInt(selectedPhase, 10);
    if (selectedStage !== "") data.stage = parseInt(selectedStage, 10);
    if (Object.keys(data).length === 0) return;
    setPlanSubmitting(true);
    try {
      await onUpdatePlan(user.id, data);
      showFeedback("success", "Plan actualizado correctamente.");
    } catch {
      showFeedback("error", "Error al actualizar el plan.");
    } finally {
      setPlanSubmitting(false);
    }
  };

  const handleCreatePlan = async () => {
    setCreatePlanSubmitting(true);
    try {
      await onCreatePlan(user.id, parseInt(createPlanPhase, 10));
      showFeedback("success", "Plan creado correctamente.");
    } catch {
      showFeedback("error", "Error al crear el plan.");
    } finally {
      setCreatePlanSubmitting(false);
    }
  };

  const handleUpdatePlanDetails = async () => {
    const data: {
      currentWeek?: number;
      progressRoutine?: number;
      progressExercise?: number;
    } = {};

    const week = parseInt(editWeek, 10);
    const pRoutine = parseInt(editProgressRoutine, 10);
    const pExercise = parseInt(editProgressExercise, 10);

    if (!isNaN(week) && week !== user.plan?.currentWeek)
      data.currentWeek = week;
    if (!isNaN(pRoutine) && pRoutine !== user.plan?.progressRoutine)
      data.progressRoutine = pRoutine;
    if (!isNaN(pExercise) && pExercise !== user.plan?.progressExercise)
      data.progressExercise = pExercise;

    if (Object.keys(data).length === 0) return;
    setPlanDetailsSubmitting(true);
    try {
      await onUpdatePlanDetails(user.id, data);
      showFeedback("success", "Detalles del plan actualizados.");
    } catch {
      showFeedback("error", "Error al actualizar detalles del plan.");
    } finally {
      setPlanDetailsSubmitting(false);
    }
  };

  const handleToggleCompletedToday = async () => {
    setPlanDetailsSubmitting(true);
    try {
      await onUpdatePlanDetails(user.id, {
        completedToday: !user.plan?.completedToday,
      });
      showFeedback("success", "Estado actualizado.");
    } catch {
      showFeedback("error", "Error al cambiar estado.");
    } finally {
      setPlanDetailsSubmitting(false);
    }
  };

  const handleToggleTask = async (key: string, currentValue: boolean) => {
    setTasksSubmitting(true);
    try {
      await onUpdateTasks(user.id, { [key]: !currentValue });
      showFeedback("success", "Tarea actualizada.");
    } catch {
      showFeedback("error", "Error al actualizar la tarea.");
    } finally {
      setTasksSubmitting(false);
    }
  };

  const handleSetFatigue = async () => {
    const level = parseInt(fatigueLevel, 10);
    if (isNaN(level) || level < 1 || level > 10) return;
    setFatigueSubmitting(true);
    try {
      await onSetFatigue(user.id, level);
      showFeedback("success", `Fatiga nivel ${level} registrada.`);
    } catch {
      showFeedback("error", "Error al registrar fatiga.");
    } finally {
      setFatigueSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) return;
    setPasswordSubmitting(true);
    try {
      await onResetPassword(user.id, newPassword);
      setNewPassword("");
      showFeedback("success", "Contrasena actualizada correctamente.");
    } catch {
      showFeedback("error", "Error al resetear la contrasena.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleSendResetEmail = async () => {
    setEmailSending(true);
    try {
      await onSendResetEmail(user.id);
      showFeedback("success", "Email de recuperacion enviado correctamente.");
    } catch {
      showFeedback("error", "Error al enviar el email de recuperacion.");
    } finally {
      setEmailSending(false);
    }
  };

  const handleResetPlan = async () => {
    setResetPlanSubmitting(true);
    try {
      await onResetPlan(user.id);
      setConfirmResetPlan(false);
      showFeedback("success", "Plan reseteado correctamente.");
    } catch {
      showFeedback("error", "Error al resetear el plan.");
    } finally {
      setResetPlanSubmitting(false);
    }
  };

  const handleDeleteCache = async () => {
    setDeleteCacheSubmitting(true);
    try {
      await onDeletePrescriptionCache(user.id);
      setConfirmDeleteCache(false);
      showFeedback("success", "Cache de prescripcion limpiado.");
    } catch {
      showFeedback("error", "Error al limpiar el cache.");
    } finally {
      setDeleteCacheSubmitting(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "prescriptions") {
      onFetchPrescriptions(user.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-purple/15 shadow-2xl">
        {!user ? (
          <div className="py-12 text-center text-gray-500">
            Cargando informacion del usuario...
          </div>
        ) : (
          <>
            <DialogHeader className="relative pb-5 border-b-2 border-purple/10 bg-gradient-to-br from-white via-purple/3 to-magent/5 -m-6 mb-0 p-6 rounded-t-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple via-magent to-purple shadow-md border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl font-bold text-black">
                    {user.fullName ?? "Usuario"}
                  </DialogTitle>
                  <p className="text-xs text-gray-500 font-medium">
                    {user.email ?? "Sin email"}
                  </p>
                </div>
                {/* Debug badge */}
                {user.debug && (
                  <Badge className="bg-amber-100 text-amber-700 border border-amber-300 font-semibold text-xs">
                    <Bug className="w-3 h-3 mr-1" />
                    DEBUG
                  </Badge>
                )}
              </div>
            </DialogHeader>

            {/* Tabs */}
            <div className="flex gap-2 pt-4 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? "bg-gradient-to-r from-purple to-magent text-white shadow-lg"
                        : "bg-white text-gray-600 border border-purple/15 hover:border-purple/30 hover:bg-purple/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`p-3 rounded-xl border text-sm font-medium ${
                  feedback.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {loading && (
              <div className="py-8 text-center text-gray-400">
                Cargando informacion del usuario...
              </div>
            )}

            {!loading && (
              <>
                {/* Tab: Info */}
                {activeTab === "info" && (
                  <div className="space-y-4">
                    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Informacion general
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Email
                          </p>
                          <p className="text-sm font-semibold text-black">
                            {user.email ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Nombre
                          </p>
                          <p className="text-sm font-semibold text-black">
                            {user.fullName ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Fecha de creacion
                          </p>
                          <p className="text-sm font-semibold text-black">
                            {formatDate(user.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Ultimo acceso
                          </p>
                          <p className="text-sm font-semibold text-black">
                            {formatDateTime(user.lastSignInAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Rol
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select
                          value={selectedRole}
                          onValueChange={setSelectedRole}
                          className="flex-1"
                        >
                          <SelectItem value={USER_ROLES.ADMIN}>
                            Administrador
                          </SelectItem>
                          <SelectItem value={USER_ROLES.USER}>
                            Usuario
                          </SelectItem>
                        </Select>
                        <Button
                          size="sm"
                          onClick={handleUpdateRole}
                          disabled={
                            roleSubmitting || selectedRole === user.role
                          }
                          className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 font-semibold"
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          {roleSubmitting ? "Guardando..." : "Cambiar rol"}
                        </Button>
                      </div>
                    </div>

                    {/* Debug mode */}
                    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-200/50">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Modo debug
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        Los usuarios debug pueden saltear restricciones de
                        tiempo y modificar su progreso para pruebas.
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`font-semibold ${
                            user.debug
                              ? "bg-amber-100 text-amber-700 border border-amber-300"
                              : "bg-gray-200 text-gray-500 border border-gray-300"
                          }`}
                        >
                          {user.debug ? "Activado" : "Desactivado"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline_magent"
                          onClick={handleToggleDebug}
                          disabled={debugSubmitting}
                          className={`font-semibold ${
                            user.debug
                              ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                              : "border-amber-300 text-amber-600 hover:bg-amber-50"
                          }`}
                        >
                          <Bug className="w-4 h-4 mr-1" />
                          {debugSubmitting
                            ? "Cambiando..."
                            : user.debug
                              ? "Desactivar debug"
                              : "Activar debug"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Plan */}
                {activeTab === "plan" && (
                  <div className="space-y-4">
                    {/* Create plan if user has none */}
                    {!user.plan && (
                      <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-green-200/50">
                        <div className="flex items-center gap-2.5 pb-1">
                          <div className="w-1 h-5 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full" />
                          <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                            Crear plan
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          Este usuario no tiene un plan asignado. Selecciona una
                          fase para crear un plan nuevo.
                        </p>
                        <div className="flex items-end gap-3">
                          <div className="flex-1 space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">
                              Fase
                            </Label>
                            <Select
                              value={createPlanPhase}
                              onValueChange={setCreatePlanPhase}
                            >
                              {Object.entries(PHASE_LABELS).map(
                                ([val, label]) => (
                                  <SelectItem key={val} value={val}>
                                    {label}
                                  </SelectItem>
                                ),
                              )}
                            </Select>
                          </div>
                          <Button
                            size="sm"
                            onClick={handleCreatePlan}
                            disabled={createPlanSubmitting}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {createPlanSubmitting ? "Creando..." : "Crear plan"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Current plan info */}
                    {user.plan && (
                      <>
                        <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                          <div className="flex items-center gap-2.5 pb-1">
                            <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                            <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                              Estado actual del plan
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Fase
                              </p>
                              <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold mt-1">
                                {PHASE_LABELS[user.plan.phase as PhaseEnum] ??
                                  `Fase ${user.plan.phase}`}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Etapa
                              </p>
                              <Badge className="bg-blue-100 text-blue-700 border border-blue-200 font-semibold mt-1">
                                {STAGE_LABELS[user.plan.stage as StageEnum] ??
                                  `Etapa ${user.plan.stage}`}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Semana
                              </p>
                              <p className="text-sm font-semibold text-black">
                                {user.plan.currentWeek} / {user.plan.totalWeeks}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Completado hoy
                              </p>
                              <button
                                onClick={handleToggleCompletedToday}
                                disabled={planDetailsSubmitting}
                                className="mt-1"
                              >
                                <Badge
                                  className={`font-semibold cursor-pointer transition-colors ${
                                    user.plan.completedToday
                                      ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                                      : "bg-gray-200 text-gray-500 border border-gray-300 hover:bg-gray-300"
                                  }`}
                                >
                                  {user.plan.completedToday ? "Si" : "No"}{" "}
                                  <span className="text-[10px] opacity-60">
                                    (click para cambiar)
                                  </span>
                                </Badge>
                              </button>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Progreso rutina
                              </p>
                              <p className="text-sm font-semibold text-black">
                                {user.plan.progressRoutine}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Progreso ejercicio
                              </p>
                              <p className="text-sm font-semibold text-black">
                                {user.plan.progressExercise}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Edit plan details */}
                        <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                          <div className="flex items-center gap-2.5 pb-1">
                            <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                            <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                              Editar detalles del plan
                            </h3>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-gray-600">
                                Semana actual
                              </Label>
                              <Input
                                type="number"
                                min={1}
                                value={editWeek}
                                onChange={(e) => setEditWeek(e.target.value)}
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-gray-600">
                                Progreso rutina
                              </Label>
                              <Input
                                type="number"
                                min={0}
                                value={editProgressRoutine}
                                onChange={(e) =>
                                  setEditProgressRoutine(e.target.value)
                                }
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-gray-600">
                                Progreso ejercicio
                              </Label>
                              <Input
                                type="number"
                                min={0}
                                value={editProgressExercise}
                                onChange={(e) =>
                                  setEditProgressExercise(e.target.value)
                                }
                                className="h-9"
                              />
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={handleUpdatePlanDetails}
                            disabled={planDetailsSubmitting}
                            className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 font-semibold"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            {planDetailsSubmitting
                              ? "Guardando..."
                              : "Guardar detalles"}
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Tasks */}
                    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Tareas de onboarding
                        </h3>
                      </div>
                      {user.tasks ? (
                        <div className="grid grid-cols-2 gap-3">
                          {(
                            [
                              {
                                key: "profileCompleted",
                                label: "Perfil completado",
                                done: user.tasks.profileCompleted,
                              },
                              {
                                key: "firstEvaluationCompleted",
                                label: "1a evaluacion",
                                done: user.tasks.firstEvaluationCompleted,
                              },
                              {
                                key: "secondEvaluationCompleted",
                                label: "2a evaluacion",
                                done: user.tasks.secondEvaluationCompleted,
                              },
                              {
                                key: "dailyPlanCompleted",
                                label: "Plan diario",
                                done: user.tasks.dailyPlanCompleted,
                              },
                            ] as const
                          ).map((task) => (
                            <button
                              key={task.key}
                              onClick={() =>
                                handleToggleTask(task.key, task.done)
                              }
                              disabled={tasksSubmitting}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors cursor-pointer text-left"
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                  task.done
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-400"
                                }`}
                              >
                                <Check className="w-3 h-3" />
                              </div>
                              <span className="text-sm text-gray-700">
                                {task.label}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-auto">
                                click para cambiar
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          No hay tareas registradas para este usuario.
                        </p>
                      )}
                    </div>

                    {/* Fatigue */}
                    <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Fatiga
                        </h3>
                      </div>
                      {user.latestFatigue && (
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs text-gray-500 font-medium">
                            Ultima reportada:
                          </span>
                          <Badge
                            className={`font-semibold text-sm border ${
                              user.latestFatigue.level >= 7
                                ? "bg-red-100 text-red-700 border-red-200"
                                : user.latestFatigue.level >= 4
                                  ? "bg-amber-100 text-amber-700 border-amber-200"
                                  : "bg-green-100 text-green-700 border-green-200"
                            }`}
                          >
                            Nivel: {user.latestFatigue.level}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(user.latestFatigue.date)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-end gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-gray-600">
                            Registrar nueva fatiga (1-10)
                          </Label>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            value={fatigueLevel}
                            onChange={(e) => setFatigueLevel(e.target.value)}
                            className="w-24 h-9"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={handleSetFatigue}
                          disabled={fatigueSubmitting}
                          className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 font-semibold"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          {fatigueSubmitting ? "Registrando..." : "Registrar"}
                        </Button>
                      </div>
                    </div>

                    {/* Change phase/stage */}
                    {user.plan && (
                      <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                        <div className="flex items-center gap-2.5 pb-1">
                          <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                          <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                            Cambiar fase / etapa
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">
                              Fase
                            </Label>
                            <Select
                              value={selectedPhase}
                              onValueChange={setSelectedPhase}
                            >
                              <SelectItem value="">— Sin cambio —</SelectItem>
                              {Object.entries(PHASE_LABELS).map(
                                ([val, label]) => (
                                  <SelectItem key={val} value={val}>
                                    {label}
                                  </SelectItem>
                                ),
                              )}
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">
                              Etapa
                            </Label>
                            <Select
                              value={selectedStage}
                              onValueChange={setSelectedStage}
                            >
                              <SelectItem value="">— Sin cambio —</SelectItem>
                              {Object.entries(STAGE_LABELS).map(
                                ([val, label]) => (
                                  <SelectItem key={val} value={val}>
                                    {label}
                                  </SelectItem>
                                ),
                              )}
                            </Select>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={handleUpdatePlan}
                          disabled={
                            planSubmitting ||
                            (selectedPhase === "" && selectedStage === "")
                          }
                          className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 font-semibold"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {planSubmitting ? "Guardando..." : "Actualizar plan"}
                        </Button>
                      </div>
                    )}

                    {/* Danger zone */}
                    <div className="space-y-4 p-5 rounded-xl bg-red-50/50 border border-red-200/50">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
                        <h3 className="text-xs font-bold text-red-700 uppercase tracking-widest">
                          Acciones avanzadas
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {!confirmResetPlan ? (
                          <Button
                            size="sm"
                            variant="outline_magent"
                            onClick={() => setConfirmResetPlan(true)}
                            className="border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Resetear progreso
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-600 font-medium">
                              Seguro? Esto reinicia todo el progreso.
                            </span>
                            <Button
                              size="sm"
                              onClick={handleResetPlan}
                              disabled={resetPlanSubmitting}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              {resetPlanSubmitting
                                ? "Reseteando..."
                                : "Confirmar"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline_magent"
                              onClick={() => setConfirmResetPlan(false)}
                              className="font-semibold"
                            >
                              Cancelar
                            </Button>
                          </div>
                        )}

                        {!confirmDeleteCache ? (
                          <Button
                            size="sm"
                            variant="outline_magent"
                            onClick={() => setConfirmDeleteCache(true)}
                            className="border-amber-200 text-amber-600 hover:bg-amber-50 font-semibold"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Limpiar cache IA
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-600 font-medium">
                              Seguro? Se regeneraran las prescripciones.
                            </span>
                            <Button
                              size="sm"
                              onClick={handleDeleteCache}
                              disabled={deleteCacheSubmitting}
                              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                            >
                              {deleteCacheSubmitting
                                ? "Limpiando..."
                                : "Confirmar"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline_magent"
                              onClick={() => setConfirmDeleteCache(false)}
                              className="font-semibold"
                            >
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Prescriptions */}
                {activeTab === "prescriptions" && (
                  <div className="space-y-4">
                    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Historial de prescripciones
                        </h3>
                      </div>
                      {prescriptionsLoading ? (
                        <div className="py-4 text-center text-gray-400 text-sm">
                          Cargando prescripciones...
                        </div>
                      ) : prescriptions.length === 0 ? (
                        <p className="text-sm text-gray-400">
                          No hay prescripciones registradas para este usuario.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {prescriptions.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-white border border-purple/10"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-black">
                                    {formatDate(p.date)}
                                  </span>
                                  <Badge
                                    className={`text-xs font-semibold ${
                                      p.source === "ai"
                                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                                        : p.source === "static"
                                          ? "bg-gray-200 text-gray-600 border border-gray-300"
                                          : "bg-amber-100 text-amber-700 border border-amber-200"
                                    }`}
                                  >
                                    {p.source}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Fase:{" "}
                                  {PHASE_LABELS[p.phase as PhaseEnum] ??
                                    p.phase}{" "}
                                  | Etapa:{" "}
                                  {STAGE_LABELS[p.stage as StageEnum] ??
                                    p.stage}
                                </p>
                              </div>
                              <span className="text-xs text-gray-400">
                                {formatDateTime(p.createdAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Account */}
                {activeTab === "account" && (
                  <div className="space-y-4">
                    {/* Send reset email */}
                    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Recuperacion de contrasena
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        Envia un email al usuario con un enlace para que pueda
                        restablecer su contrasena.
                      </p>
                      <Button
                        size="sm"
                        variant="outline_magent"
                        onClick={handleSendResetEmail}
                        disabled={emailSending}
                        className="font-semibold"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        {emailSending
                          ? "Enviando..."
                          : "Enviar email de recuperacion"}
                      </Button>
                    </div>

                    {/* Set password directly */}
                    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Establecer nueva contrasena
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        Establece una nueva contrasena directamente. El usuario
                        debera usarla en su proximo inicio de sesion.
                      </p>
                      <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-2">
                          <Label
                            htmlFor="new-password"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Nueva contrasena (minimo 6 caracteres)
                          </Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={handleResetPassword}
                          disabled={
                            passwordSubmitting || newPassword.length < 6
                          }
                          className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 font-semibold"
                        >
                          <Key className="w-4 h-4 mr-1" />
                          {passwordSubmitting ? "Guardando..." : "Establecer"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Profile */}
                {activeTab === "profile" && (
                  <div className="space-y-4">
                    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                          Respuestas del perfil
                        </h3>
                      </div>
                      {user.profileAnswers && user.profileAnswers.length > 0 ? (
                        <div className="space-y-3">
                          {user.profileAnswers.map((answer, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-white border border-purple/10"
                            >
                              <p className="text-xs text-gray-500 font-medium">
                                {answer.questionTitle}
                              </p>
                              <p className="text-sm font-semibold text-black mt-0.5">
                                {answer.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          El usuario no ha completado el cuestionario de perfil.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
