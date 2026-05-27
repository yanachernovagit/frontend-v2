import { useCallback, useEffect, useState } from "react";

import { AIConfig, AIStats } from "@/types";
import {
  getAIConfig,
  updateAIConfig as updateAIConfigService,
  getAIStats,
} from "@/services/adminAIService";

export function useAdminAI() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAIConfig();
      setConfig(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar configuración de IA",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setError(null);
    try {
      const data = await getAIStats();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar estadísticas de IA",
      );
    }
  }, []);

  const updateConfig = async (
    data: Partial<Omit<AIConfig, "provider" | "model">>,
  ) => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const updated = await updateAIConfigService(data);
      setConfig(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return updated;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar configuración",
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchStats();
  }, [fetchConfig, fetchStats]);

  return {
    config,
    stats,
    loading,
    saving,
    error,
    saveSuccess,
    refetchConfig: fetchConfig,
    refetchStats: fetchStats,
    updateConfig,
  };
}
