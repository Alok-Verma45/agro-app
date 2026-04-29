import API from "./axios";

// OFFLINE
export const getOfflineDashboard = () => {
  return API.get("/dashboard/offline");
};

// ONLINE
export const getOnlineDashboard = () => {
  return API.get("/dashboard/online");
};