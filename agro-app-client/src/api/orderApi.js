import axios from "axios";

const API = "http://localhost:8080/api/orders";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 🔥 PLACE ORDER
export const placeOrder = () => {
  return axios.post(`${API}/place`, {}, {
    headers: getAuthHeader(),
  });
};