import authApi from "./authApi";
import { AdminUser } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.USERS.LIST);
    return response.data;
  } catch {
    throw new Error("No se pudieron obtener los usuarios.");
  }
}

export async function updateAdminUserRole(
  id: string,
  role: string,
): Promise<AdminUser> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.USERS.UPDATE_ROLE(id),
      { role },
    );
    return response.data;
  } catch {
    throw new Error("No se pudo actualizar el rol.");
  }
}
