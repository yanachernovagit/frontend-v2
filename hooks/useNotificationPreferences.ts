import { useState, useEffect, useCallback } from "react";
import {
  getNotificationPreferencesService,
  updateNotificationPreferencesService,
} from "@/services/notificationService";
import type { NotificationPreferences } from "@/services/notificationService";
import { useAuth } from "@/hooks/useAuth";

export type { NotificationPreferences };

const __DEV__ = false;

export function useNotificationPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationPreferencesService();
      setPreferences(data);
    } catch (err) {
      const message =
        "No se pudieron cargar las preferencias de notificaciones.";
      setError(message);
      if (__DEV__) {
        console.warn(
          "[useNotificationPreferences] fetchPreferences failed:",
          err,
        );
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = useCallback(
    (key: keyof NotificationPreferences, value: boolean | string) => {
      const previousPreferences = preferences;
      if (!previousPreferences) return;

      setPreferences({
        ...previousPreferences,
        [key]: value,
      });

      setUpdating(true);
      setError(null);
      void updateNotificationPreferencesService({
        [key]: value,
      })
        .then((updated) => {
          setPreferences(updated);
        })
        .catch((err) => {
          setPreferences(previousPreferences);
          const message = "No se pudo actualizar la preferencia.";
          setError(message);
          if (__DEV__) {
            console.warn(
              "[useNotificationPreferences] updatePreference failed:",
              err,
            );
          }
        })
        .finally(() => {
          setUpdating(false);
        });
    },
    [preferences],
  );

  return {
    preferences,
    loading,
    updating,
    error,
    updatePreference,
    refetch: fetchPreferences,
  };
}
