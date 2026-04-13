import API from "./axios";

// 📦 Get all credits
export const getCredits = () => API.get("/credits");

// ➕ Create credit (customerId required)
export const addCredit = (customerId, data) =>
  API.post(`/credits/${customerId}`, data);

// 📦 Get credits by customer
export const getCreditsByCustomer = (customerId) =>
  API.get(`/credits/customer/${customerId}`);

// 💰 Add payment
export const addPayment = (creditId, amount) =>
  API.post(`/credits/${creditId}/pay?amount=${amount}`);

// 📊 Dashboard data
export const getDashboardData = () =>
  API.get("/credits/dashboard");

// 📊 Customer pending list
export const getCustomerPending = () =>
  API.get("/credits/customer-pending");

// 🏆 Top customers
export const getTopCustomers = () =>
  API.get("/credits/top-customers");