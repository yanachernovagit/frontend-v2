import authApi from "./authApi";
import { NotificationTemplate, NotificationLog, NotificationStats } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

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
    return response.data;
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
