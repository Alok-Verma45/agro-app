import API from "./axios";

// 🛒 PLACE ORDER
export const placeOrder = (data) =>
  API.post("/orders/place", data);

// 📦 MY ORDERS
export const getMyOrders = () =>
  API.get("/orders/my");

// 🔍 ORDER DETAILS
export const getOrderById = (id) =>
  API.get(`/orders/${id}`);

// 🧾 ADMIN ALL ORDERS
export const getAllOrders = () =>
  API.get("/orders/all");

// 🔄 UPDATE STATUS
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status?status=${status}`);