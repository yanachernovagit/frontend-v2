import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
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
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo subir el archivo.",
      }),
    );
  }
}

export async function getAdminMediaAssets(): Promise<MediaAsset[]> {
  try {
    const response = await authApi.get<MediaAsset[]>(
      ADMIN_ENDPOINTS.MEDIA.LIST,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudieron obtener los archivos.",
      }),
    );
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
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo renombrar el archivo.",
      }),
    );
  }
}

export async function deleteAdminMedia(key: string): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.MEDIA.DELETE, {
      params: { key },
    });
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo eliminar el archivo.",
      }),
    );
  }
}
