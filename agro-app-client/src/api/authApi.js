import API from "./axios";

// 🔐 LOGIN
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

// 🆕 SIGNUP
export const signupUser = (data) => {
  return API.post("/auth/register", data);
};

// 📩 FORGOT PASSWORD
export const forgotPassword = (data) => {
  return API.post("/auth/forgot-password", data);
};

// 🔁 RESET PASSWORD
export const resetPassword = (data) => {
  return API.post("/auth/reset-password", data);
};