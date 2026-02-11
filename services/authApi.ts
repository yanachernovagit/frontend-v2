import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { AuthEvents, AuthStorage } from "@/hooks/useAuth";
import api from "./api";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!baseURL) {
  console.warn("[config] NEXT_PUBLIC_BACKEND_URL is not defined");
}

const authApi = axios.create({
  baseURL,
  timeout: 10000,
});

authApi.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== "undefined") {
      const token = await AuthStorage.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Silently fail if token read fails
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AuthStorage.getRefresh();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await api.post(ENDPOINTS.AUTH.REFRESH, {
          refreshToken,
        });
        const { accessToken, refreshToken: nextRefreshToken } =
          refreshResponse.data ?? {};

        if (!accessToken) {
          throw new Error("Invalid refresh response");
        }

        await AuthStorage.set(accessToken);
        if (nextRefreshToken) {
          await AuthStorage.setRefresh(nextRefreshToken);
        }

        AuthEvents.emit(accessToken);

        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set("Authorization", `Bearer ${accessToken}`);
        originalRequest.headers = headers;

        return authApi(originalRequest);
      } catch {
        // Refresh failed — fall through to redirect
      }
    }

    if (status === 401) {
      await AuthStorage.clear();
      AuthEvents.emit(null);
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  },
);

export default authApi;
