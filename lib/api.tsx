import { useBusiness } from "@/contexts/BusinessContext";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export const useApi = () => {
  const { getToken } = useAuth();
  const { activeBusiness } = useBusiness();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    timeout: 10000,
  });

  api.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      if (activeBusiness?.id) {
        config.headers.set("X-Business-Id", activeBusiness.id);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return api;
};
