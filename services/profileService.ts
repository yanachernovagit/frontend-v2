import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";
import type { UpdateProfileDto } from "@/types";

export async function uploadProfilePicture(
  file: File,
): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await authApi.post<{ url: string }>(
      ENDPOINTS.PROFILE.PICTURE,
      formData,
    );
    return response.data;
  } catch {
    throw new Error("No se pudo subir la foto de perfil.");
  }
}

export async function updateProfileService(
  payload: UpdateProfileDto,
): Promise<void> {
  try {
    await authApi.patch(ENDPOINTS.PROFILE.EDIT, payload);
  } catch {
    throw new Error("No se pudo actualizar el perfil.");
  }
}
