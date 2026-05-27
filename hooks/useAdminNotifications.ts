import { useCallback, useEffect, useState } from "react";

import {
  NotificationTemplate,
  NotificationLog,
  NotificationStats,
} from "@/types";
import {
  getNotificationTemplates,
  updateNotificationTemplate,
  getNotificationStats,
  getNotificationLogs,
  sendTestNotification,
} from "@/services/adminNotificationsService";

export function useAdminNotifications() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logsFetched, setLogsFetched] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationTemplates();
      setTemplates(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar plantillas",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setError(null);
    try {
      const data = await getNotificationStats();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar estadisticas",
      );
    }
  }, []);

  const fetchLogs = useCallback(async (page?: number, limit?: number) => {
    setLogsLoading(true);
    setError(null);
    try {
      const data = await getNotificationLogs(page, limit);
      setLogs(data);
      setLogsFetched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar registros",
      );
    } finally {
      setLogsLoading(false);
    }
  }, []);

  const updateTemplate = async (
    id: string,
    data: Partial<NotificationTemplate>,
  ) => {
    setError(null);
    try {
      const updated = await updateNotificationTemplate(id, data);
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar plantilla",
      );
      throw err;
    }
  };

  const sendTest = async (userId: string, title: string, body: string) => {
    setError(null);
    await sendTestNotification(userId, title, body);
  };

  useEffect(() => {
    fetchTemplates();
    fetchStats();
  }, [fetchTemplates, fetchStats]);

  return {
    templates,
    logs,
    logsFetched,
    stats,
    loading,
    logsLoading,
    error,
    fetchTemplates,
    fetchStats,
    fetchLogs,
    updateTemplate,
    sendTest,
  };
}
