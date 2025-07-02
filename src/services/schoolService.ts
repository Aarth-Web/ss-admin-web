import api from "./api";

export const schoolService = {
  getSchools: async (page = 1, limit = 10, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) {
      params.append("search", search);
    }
    const response = await api.get(`/schools?${params.toString()}`);
    return response.data;
  },

  createSchool: async (schoolData: { name: string; address: string }) => {
    const response = await api.post("/schools", schoolData);
    return response.data;
  },

  getSchoolById: async (id: string) => {
    const response = await api.get(`/schools/${id}`);
    return response.data;
  },

  updateSchool: async (
    id: string,
    schoolData: { name?: string; address?: string; isActive?: boolean }
  ) => {
    const response = await api.patch(`/schools/${id}`, schoolData);
    return response.data;
  },

  deleteSchool: async (id: string) => {
    const response = await api.delete(`/schools/${id}`);
    return response.data;
  },
};
