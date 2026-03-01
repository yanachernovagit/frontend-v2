import authApi from "./authApi";
import {
  NotificationTemplate,
  NotificationLog,
  NotificationStats,
} from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

function parseNotificationCount(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (value && typeof value === "object" && "_all" in value) {
    const all = (value as { _all?: unknown })._all;
    return typeof all === "number" ? all : 0;
  }

  return 0;
}

export async function getNotificationTemplates(): Promise<
  NotificationTemplate[]
> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.NOTIFICATIONS.TEMPLATES);
    return response.data;
  } catch {
    throw new Error("No se pudieron obtener las plantillas de notificacion.");
  }
}

export async function updateNotificationTemplate(
  id: string,
  data: Partial<NotificationTemplate>,
): Promise<NotificationTemplate> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.NOTIFICATIONS.UPDATE_TEMPLATE(id),
      data,
    );
    return response.data;
  } catch {
    throw new Error("No se pudo actualizar la plantilla.");
  }
}

export async function getNotificationStats(): Promise<NotificationStats> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.NOTIFICATIONS.STATS);
    const raw = response.data;

    // Transform backend shape { total, today, byType: [{ type, _count }] }
    // to frontend shape { totalSent, sentToday, byType: Record<string, number> }
    const byType: Record<string, number> = {};
    if (Array.isArray(raw.byType)) {
      for (const item of raw.byType) {
        byType[item.type] = parseNotificationCount(item._count);
      }
    } else if (raw.byType && typeof raw.byType === "object") {
      Object.assign(byType, raw.byType);
    }

    return {
      totalSent: raw.totalSent ?? raw.total ?? 0,
      sentToday: raw.sentToday ?? raw.today ?? 0,
      byType,
    };
  } catch {
    throw new Error("No se pudieron obtener las estadisticas.");
  }
}

export async function getNotificationLogs(
  page?: number,
  limit?: number,
): Promise<NotificationLog[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.NOTIFICATIONS.LOGS, {
      params: { page, limit },
    });
    return response.data;
  } catch {
    throw new Error("No se pudieron obtener los registros.");
  }
}

export async function sendTestNotification(
  userId: string,
  title: string,
  body: string,
): Promise<void> {
  try {
    await authApi.post(ADMIN_ENDPOINTS.NOTIFICATIONS.SEND_TEST, {
      userId,
      title,
      body,
    });
  } catch {
    throw new Error("No se pudo enviar la notificacion de prueba.");
  }
}
