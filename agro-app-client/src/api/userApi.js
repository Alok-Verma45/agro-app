import API from "./axios";

// ======================
// GET ALL USERS
// ======================
export const getAllUsers = () =>
  API.get("/admin/users");

// ======================
// UPDATE ROLE
// ======================
export const updateUserRole = (id, role) =>
  API.put(`/admin/users/${id}/role?role=${role}`);

// ======================
// DELETE USER
// ======================
export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`);