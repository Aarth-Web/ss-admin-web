import api from "./api";
import { API_CONFIG } from "../config";

export const userService = {
  getUsers: async (role?: string) => {
    const params = role ? { role } : {};
    const response = await api.get("/users", { params });
    return response.data;
  },

  getSchoolUsers: async (schoolId: string) => {
    const response = await api.get(`/users/school/${schoolId}`);
    return response.data;
  },

  /**
   * @deprecated Use authService.onboardUser instead
   */
  createUser: async (userData: any) => {
    console.warn(
      "userService.createUser is deprecated. Please use authService.onboardUser instead"
    );
    const response = await api.post("/users", userData);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    // Format the mobile number if it exists and doesn't already have the country code prefix
    if (userData.mobile && !userData.mobile.startsWith("+")) {
      userData.mobile = `+${API_CONFIG.COUNTRY_CODE}${userData.mobile}`;
    }

    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  blockUser: async (id: string) => {
    const response = await api.patch(`/users/${id}`, { status: "blocked" });
    return response.data;
  },

  unblockUser: async (id: string) => {
    const response = await api.patch(`/users/${id}`, { status: "active" });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
