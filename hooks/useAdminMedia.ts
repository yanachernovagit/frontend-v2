import { useCallback, useEffect, useState } from "react";

import { MediaAsset } from "@/types";
import {
  deleteAdminMedia,
  getAdminMediaAssets,
  renameAdminMedia,
} from "@/services/adminMediaService";

export function useAdminMedia() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminMediaAssets();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar archivos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    loading,
    error,
    refetch: fetchAssets,
    renameAsset: async (key: string, newName: string, folder?: string) => {
      await renameAdminMedia({ key, newName, folder });
      await fetchAssets();
    },
    deleteAsset: async (key: string) => {
      await deleteAdminMedia(key);
      setAssets((prev) => prev.filter((item) => item.key !== key));
    },
  };
}
