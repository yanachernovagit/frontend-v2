import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
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
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo subir la foto de perfil.",
      }),
    );
  }
}

export async function updateProfileService(
  payload: UpdateProfileDto,
): Promise<void> {
  try {
    await authApi.patch(ENDPOINTS.PROFILE.EDIT, payload);
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo actualizar el perfil.",
      }),
    );
  }
}
