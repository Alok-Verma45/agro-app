import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/dashboard`;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// OFFLINE
export const getOfflineDashboard = () => {
  return axios.get(`${API}/offline`, {
    headers: getAuthHeader(),
  });
};

// ONLINE
export const getOnlineDashboard = () => {
  return axios.get(`${API}/online`, {
    headers: getAuthHeader(),
  });
};