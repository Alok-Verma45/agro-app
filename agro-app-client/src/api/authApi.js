import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/auth`;

// 🔐 LOGIN
export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};

// 🆕 SIGNUP
export const signupUser = (data) => {
  return axios.post(`${API}/register`, data);
};

// 📩 FORGOT PASSWORD
export const forgotPassword = (data) => {
  return axios.post(`${API}/forgot-password`, data);
};

// 🔁 RESET PASSWORD
export const resetPassword = (data) => {
  return axios.post(`${API}/reset-password`, data);
};