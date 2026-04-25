import axios from "axios";

const API = "http://localhost:8080/api/admin/users";

// ======================
// AUTH HEADER
// ======================
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ======================
// GET ALL USERS
// ======================
export const getAllUsers = () => {
  return axios.get(API, {
    headers: getAuthHeader(),
  });
};

// ======================
// UPDATE ROLE
// ======================
export const updateUserRole = (id, role) => {
  return axios.put(
    `${API}/${id}/role?role=${role}`,
    {},
    {
      headers: getAuthHeader(),
    }
  );
};

// ======================
// DELETE USER
// ======================
export const deleteUser = (id) => {
  return axios.delete(`${API}/${id}`, {
    headers: getAuthHeader(),
  });
};