"use client";

import { useState, useEffect, useCallback } from "react";
import authApi from "@/services/authApi";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

interface AdminStats {
  evaluations: number;
  exercises: number;
  routines: number;
  questions: number;
  users: number;
}

const initialStats: AdminStats = {
  evaluations: 0,
  exercises: 0,
  routines: 0,
  questions: 0,
  users: 0,
};

// Cache simple para evitar re-fetches
let cachedStats: AdminStats | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minuto

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>(cachedStats || initialStats);
  const [loading, setLoading] = useState(!cachedStats);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (force = false) => {
    // Usar caché si es válido
    const now = Date.now();
    if (!force && cachedStats && now - cacheTimestamp < CACHE_DURATION) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await authApi.get<AdminStats>(ADMIN_ENDPOINTS.STATS);
      const newStats = response.data;

      // Actualizar caché
      cachedStats = newStats;
      cacheTimestamp = now;

      setStats(newStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: () => fetchStats(true) };
}
