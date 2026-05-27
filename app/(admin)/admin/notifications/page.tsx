"use client";

import { useState } from "react";

import { DataTable } from "@/components/admin/DataTable";
import { TemplateFormModal } from "@/components/admin/notifications/TemplateFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { NotificationTemplate, NotificationLog } from "@/types";
import { RefreshCw, Send, BarChart3, Bell, CalendarDays } from "lucide-react";

type Tab = "templates" | "logs" | "test";

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

export default function AdminNotificationsPage() {
  const {
    templates,
    logs,
    logsFetched,
    stats,
    loading,
    logsLoading,
    error,
    fetchLogs,
    updateTemplate,
    sendTest,
  } = useAdminNotifications();

  const [activeTab, setActiveTab] = useState<Tab>("templates");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NotificationTemplate | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [testUserId, setTestUserId] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [testBody, setTestBody] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const templateColumns = [
    {
      key: "type",
      label: "Tipo",
      render: (item: NotificationTemplate) => (
        <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold">
          {item.type}
        </Badge>
      ),
    },
    { key: "title", label: "Titulo" },
    {
      key: "body",
      label: "Mensaje",
      render: (item: NotificationTemplate) => (
        <span className="text-sm text-gray-600">
          {item.body.length > 50 ? `${item.body.slice(0, 50)}...` : item.body}
        </span>
      ),
    },
    {
      key: "enabled",
      label: "Estado",
      render: (item: NotificationTemplate) =>
        item.enabled ? (
          <Badge className="bg-green-100 text-green-700 border border-green-200 font-semibold">
            Activo
          </Badge>
        ) : (
          <Badge className="bg-gray-200 text-gray-500 border border-gray-300 font-semibold">
            Inactivo
          </Badge>
        ),
    },
  ];

  const logColumns = [
    {
      key: "sentAt",
      label: "Fecha",
      render: (item: NotificationLog) => (
        <span className="text-sm text-gray-600">
          {formatDateTime(item.sentAt)}
        </span>
      ),
    },
    {
      key: "type",
      label: "Tipo",
      render: (item: NotificationLog) => (
        <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold">
          {item.type}
        </Badge>
      ),
    },
    { key: "title", label: "Titulo" },
    {
      key: "status",
      label: "Estado",
      render: (item: NotificationLog) =>
        item.status === "sent" ? (
          <Badge className="bg-green-100 text-green-700 border border-green-200 font-semibold">
            Enviado
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-600 border border-red-200 font-semibold">
            Fallido
          </Badge>
        ),
    },
  ];

  const handleEdit = (item: NotificationTemplate) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: {
    title: string;
    body: string;
    enabled: boolean;
  }) => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await updateTemplate(selectedItem.id, data);
      setFormOpen(false);
    } catch {
      // Error state is already set by updateTemplate in the hook.
      // Close the modal so the user can see the error banner.
      setFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendTest = async () => {
    if (!testUserId || !testTitle || !testBody) return;
    setTestSending(true);
    setTestResult(null);
    try {
      await sendTest(testUserId, testTitle, testBody);
      setTestResult({
        type: "success",
        message: "Notificacion de prueba enviada correctamente.",
      });
      setTestUserId("");
      setTestTitle("");
      setTestBody("");
    } catch {
      setTestResult({
        type: "error",
        message: "Error al enviar la notificacion de prueba.",
      });
    } finally {
      setTestSending(false);
    }
  };

  const handleLogsTabClick = () => {
    setActiveTab("logs");
    if (!logsFetched) {
      fetchLogs();
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "templates", label: "Plantillas" },
    { key: "logs", label: "Historial" },
    { key: "test", label: "Prueba" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple/10">
                <BarChart3 className="w-5 h-5 text-purple" />
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total enviadas
              </span>
            </div>
            <p className="text-3xl font-bold text-black">{stats.totalSent}</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <CalendarDays className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Hoy
              </span>
            </div>
            <p className="text-3xl font-bold text-black">{stats.sentToday}</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Por tipo
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {stats.byType &&
                Object.entries(stats.byType).map(([type, count]) => (
                  <Badge
                    key={type}
                    className="bg-purple/10 text-purple border border-purple/20 font-semibold text-xs"
                  >
                    {type}: {count}
                  </Badge>
                ))}
              {(!stats.byType || Object.keys(stats.byType).length === 0) && (
                <span className="text-sm text-gray-400">Sin datos</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              tab.key === "logs" ? handleLogsTabClick() : setActiveTab(tab.key)
            }
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-purple to-magent text-white shadow-lg"
                : "bg-white text-gray-600 border border-purple/15 hover:border-purple/30 hover:bg-purple/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {activeTab === "templates" && (
        <>
          <DataTable
            data={templates}
            columns={templateColumns}
            onEdit={handleEdit}
            searchKey="type"
            title="Plantillas de notificacion"
            isLoading={loading}
          />

          <TemplateFormModal
            open={formOpen}
            onOpenChange={setFormOpen}
            onSubmit={handleFormSubmit}
            initialData={selectedItem}
            isLoading={isSubmitting}
          />
        </>
      )}

      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline_magent"
              size="sm"
              onClick={() => fetchLogs()}
              disabled={logsLoading}
              className="font-semibold"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${logsLoading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </div>
          <DataTable
            data={logs}
            columns={logColumns}
            searchKey="type"
            title="Historial de notificaciones"
            isLoading={logsLoading}
          />
        </div>
      )}

      {activeTab === "test" && (
        <div className="max-w-lg space-y-6">
          <div className="space-y-7">
            <div className="flex items-center justify-between flex-wrap gap-5 p-7 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <h1 className="text-3xl font-bold text-black tracking-tight">
                  Enviar prueba
                </h1>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
            <div className="flex items-center gap-2.5 pb-1">
              <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
              <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                Datos de la notificacion
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="test-user-id"
                  className="text-black-400 text-sm font-semibold block mb-1.5"
                >
                  ID de usuario
                </label>
                <Input
                  id="test-user-id"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  placeholder="ID del usuario destinatario"
                />
              </div>
              <div>
                <label
                  htmlFor="test-title"
                  className="text-black-400 text-sm font-semibold block mb-1.5"
                >
                  Titulo
                </label>
                <Input
                  id="test-title"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="Titulo de la notificacion"
                />
              </div>
              <div>
                <label
                  htmlFor="test-body"
                  className="text-black-400 text-sm font-semibold block mb-1.5"
                >
                  Mensaje
                </label>
                <Textarea
                  id="test-body"
                  value={testBody}
                  onChange={(e) => setTestBody(e.target.value)}
                  placeholder="Cuerpo de la notificacion"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-xl border text-sm font-medium ${
                testResult.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {testResult.message}
            </div>
          )}

          <Button
            onClick={handleSendTest}
            disabled={testSending || !testUserId || !testTitle || !testBody}
            className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            {testSending ? "Enviando..." : "Enviar notificacion de prueba"}
          </Button>
        </div>
      )}
    </div>
  );
}
