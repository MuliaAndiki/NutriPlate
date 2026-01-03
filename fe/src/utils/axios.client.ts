import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import { APP_SESSION_COOKIE_KEY } from "@/configs/cookies.config";
import { env } from "../configs/env.config";

const AxiosClient = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
});

AxiosClient.interceptors.request.use((config) => {
  const token = getCookie(APP_SESSION_COOKIE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("user_role", { path: "/" });
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default AxiosClient;
