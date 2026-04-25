import API from "./axios";

// GET all products
export const getProducts = () =>
  API.get("/products");

// ADD product
export const addProduct = (data) =>
  API.post("/products", data);

// UPDATE full product
export const updateProduct = (
  id,
  data
) =>
  API.put(
    `/products/${id}`,
    data
  );

// UPDATE STOCK ONLY
export const updateProductStock = (
  id,
  quantity
) =>
  API.put(
    `/products/${id}/stock`,
    { quantity }
  );

// QUICK ADD STOCK
export const addStock = (
  id,
  qty
) =>
  API.patch(
    `/products/${id}/add-stock`,
    { quantity: qty }
  );

// DELETE product
export const deleteProduct = (
  id
) =>
  API.delete(
    `/products/${id}`
  );