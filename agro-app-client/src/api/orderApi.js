import axios from "axios";

const API = "http://localhost:8080/api/orders";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const placeOrder = (data) =>
  axios.post(`${API}/place`, data, {
    headers: getAuthHeader(),
  });

export const getMyOrders = () =>
  axios.get(`${API}/my`, {
    headers: getAuthHeader(),
  });

export const getOrderById = (id) =>
  axios.get(`${API}/${id}`, {
    headers: getAuthHeader(),
  });

export const getAllOrders = () =>
  axios.get(`${API}/all`, {
    headers: getAuthHeader(),
  });

export const updateOrderStatus = (id, status) =>
  axios.put(
    `${API}/${id}/status?status=${status}`,
    {},
    {
      headers: getAuthHeader(),
    }
  );