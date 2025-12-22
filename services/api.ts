import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!baseURL) {
  // Helps detect missing env in production builds
  console.warn("[config] NEXT_PUBLIC_BACKEND_URL is not defined");
}

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
