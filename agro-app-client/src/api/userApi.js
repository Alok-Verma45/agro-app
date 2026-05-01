import API from "./axios";

// ======================
// ADMIN APIs
// ======================
export const adminApi = {

  getAllUsers: () => API.get("/admin/users"),

  updateUserRole: (id, role) =>
    API.put(`/admin/users/${id}/role?role=${role}`),

  deleteUser: (id) =>
    API.delete(`/admin/users/${id}`),

};

// ======================
// USER APIs
// ======================
export const userApi = {

  getProfile: () => API.get("/users/me"),

  updateProfile: (data) =>
    API.put("/users/me", data),

};