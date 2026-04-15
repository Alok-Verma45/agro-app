import axios from "axios";

const API = "http://localhost:8080/api/auth"; 

// 🔐 LOGIN
export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};

// 🆕 SIGNUP
export const signupUser = (data) => {
  return axios.post(`${API}/register`, data);
};