import API from "./axios";

// GET all products
export const getProducts = () => API.get("/products");

// ADD product
export const addProduct = (data) => API.post("/products", data);

// UPDATE product
export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data);

// DELETE product
export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);