import axios from "axios";

const API = "http://localhost:8080/api/orders";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 🔥 PLACE ORDER WITH ADDRESS DATA
export const placeOrder = (orderData) => {
  return axios.post(
    `${API}/place`,
    orderData,
    {
      headers: getAuthHeader(),
    }
  );
};