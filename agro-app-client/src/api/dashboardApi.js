import axios from "axios";

const API = "http://localhost:8080/api/dashboard";

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