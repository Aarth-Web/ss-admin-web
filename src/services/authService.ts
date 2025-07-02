import api from "./api";
import { LoginCredentials, User, OnboardUserData } from "../types";
import { API_CONFIG } from "../config";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get("/auth/verify");
    return response.data;
  },

  getPermissions: async () => {
    const response = await api.get("/auth/permissions");
    return response.data;
  },

  onboardUser: async (userData: OnboardUserData) => {
    // Create a copy of userData to modify
    const formattedData = { ...userData };

    // Format mobile number if provided (add country code prefix from config)
    if (formattedData.mobile && !formattedData.mobile.startsWith("+")) {
      formattedData.mobile = `+${API_CONFIG.COUNTRY_CODE}${formattedData.mobile}`;
    }

    console.log("Onboarding user with data:", formattedData);
    const response = await api.post("/auth/onboard", formattedData);
    return response.data;
  },

  resetPassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post("/auth/reset-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
