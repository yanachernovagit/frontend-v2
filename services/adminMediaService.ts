import authApi from "./authApi";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";
import { MediaAsset, MediaRenameResponse, MediaUploadResponse } from "@/types";

export async function uploadAdminMedia(
  file: File,
  options?: { folder?: string },
): Promise<MediaUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.folder) {
      formData.append("folder", options.folder);
    }

    const response = await authApi.post<MediaUploadResponse>(
      ADMIN_ENDPOINTS.MEDIA.UPLOAD,
      formData,
    );
    return response.data;
  } catch {
    throw new Error("No se pudo subir el archivo.");
  }
}

export async function getAdminMediaAssets(): Promise<MediaAsset[]> {
  try {
    const response = await authApi.get<MediaAsset[]>(
      ADMIN_ENDPOINTS.MEDIA.LIST,
    );
    return response.data;
  } catch {
    throw new Error("No se pudieron obtener los archivos.");
  }
}

export async function renameAdminMedia(params: {
  key: string;
  newName: string;
  folder?: string;
}): Promise<MediaRenameResponse> {
  try {
    const response = await authApi.patch<MediaRenameResponse>(
      ADMIN_ENDPOINTS.MEDIA.RENAME,
      params,
    );
    return response.data;
  } catch (error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    const message =
      apiError?.response?.data?.message || "No se pudo renombrar el archivo.";
    throw new Error(message);
  }
}

export async function deleteAdminMedia(key: string): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.MEDIA.DELETE, {
      params: { key },
    });
  } catch (error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    const message =
      apiError?.response?.data?.message || "No se pudo eliminar el archivo.";
    throw new Error(message);
  }
}
