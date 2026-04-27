import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/cart`;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 🛒 GET CART
export const getCart = () => {
  return axios.get(API, {
    headers: getAuthHeader(),
  });
};

// ➕ ADD TO CART
export const addToCart = (productId, quantity = 1) => {
  return axios.post(`${API}/add`, null, {
    params: { productId, quantity },
    headers: getAuthHeader(),
  });
};

// ❌ REMOVE ITEM
export const removeItem = (itemId) => {
  return axios.delete(`${API}/item/${itemId}`, {
    headers: getAuthHeader(),
  });
};

// 🔄 UPDATE QUANTITY
export const updateQuantity = (itemId, quantity) => {
  return axios.put(`${API}/item/${itemId}`, null, {
    params: { quantity },
    headers: getAuthHeader(),
  });
};