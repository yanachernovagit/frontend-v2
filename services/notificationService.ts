import axios from "axios";
import authApi from "./authApi";
import api from "./api";
import { ENDPOINTS } from "@/constants/endpoints";

export interface NotificationPreferences {
  exerciseReminder: boolean;
  exerciseReminderTime: string;
  weeklyReport: boolean;
  inactivityReminder: boolean;
  streakNotifications: boolean;
}

export const NOTIFICATION_ERRORS = {
  REGISTER_TOKEN_FAILED: "notification_register_token_failed",
  REMOVE_TOKEN_FAILED: "notification_remove_token_failed",
  FETCH_PREFERENCES_FAILED: "notification_fetch_preferences_failed",
  UPDATE_PREFERENCES_FAILED: "notification_update_preferences_failed",
} as const;

const __DEV__ = false;

export async function registerPushTokenService(
  token: string,
  platform: string,
): Promise<void> {
  try {
    await authApi.post(ENDPOINTS.NOTIFICATIONS.REGISTER_TOKEN, {
      token,
      platform,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn(
        "[notificationService] Failed to register push token:",
        error,
      );
    }
    throw new Error(NOTIFICATION_ERRORS.REGISTER_TOKEN_FAILED);
  }
}

export async function removePushTokenService(token: string): Promise<void> {
  try {
    await authApi.delete(ENDPOINTS.NOTIFICATIONS.REMOVE_TOKEN, {
      data: { token },
    });
  } catch (error) {
    if (__DEV__) {
      console.warn("[notificationService] Failed to remove push token:", error);
    }
    throw new Error(NOTIFICATION_ERRORS.REMOVE_TOKEN_FAILED);
  }
}

/**
 * Remove push token using the plain (non-authenticated) api instance.
 * Used during logout to avoid the authApi 401 interceptor triggering
 * a token refresh race condition.
 */
export async function removePushTokenBackground(
  pushToken: string,
  accessToken: string,
): Promise<void> {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  await api.delete(`${ENDPOINTS.NOTIFICATIONS.REMOVE_TOKEN}`, {
    baseURL,
    data: { token: pushToken },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getNotificationPreferencesService(): Promise<NotificationPreferences> {
  try {
    const response = await authApi.get(ENDPOINTS.NOTIFICATIONS.PREFERENCES);
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.warn(
        "[notificationService] Failed to fetch notification preferences:",
        error,
      );
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(NOTIFICATION_ERRORS.FETCH_PREFERENCES_FAILED);
    }
    throw new Error(NOTIFICATION_ERRORS.FETCH_PREFERENCES_FAILED);
  }
}

export async function updateNotificationPreferencesService(
  data: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  try {
    const response = await authApi.patch(
      ENDPOINTS.NOTIFICATIONS.PREFERENCES,
      data,
    );
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.warn(
        "[notificationService] Failed to update notification preferences:",
        error,
      );
    }
    throw new Error(NOTIFICATION_ERRORS.UPDATE_PREFERENCES_FAILED);
  }
}
