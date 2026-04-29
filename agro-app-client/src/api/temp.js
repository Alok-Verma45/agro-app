import API from "./axios";

export const getCustomers = () => API.get("/customers");
export const addCustomer = (data) => API.post("/customers", data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);
export const updateCustomer = (id, data) =>
  API.put(`/customers/${id}`, data);