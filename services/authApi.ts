import axios from "axios";

const TOKEN_KEY = "auth_token";

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
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore storage errors silently
  }
  return config;
});

export default authApi;
