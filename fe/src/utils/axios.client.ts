import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import { APP_SESSION_COOKIE_KEY } from "@/configs/cookies.config";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const AxiosClient = axios.create({
  baseURL,
});

AxiosClient.interceptors.request.use((config) => {
  const token = getCookie(APP_SESSION_COOKIE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (baseURL.includes("ngrok")) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }

  return config;
});

AxiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("user_role", { path: "/" });
      deleteCookie(APP_SESSION_COOKIE_KEY);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default AxiosClient;
