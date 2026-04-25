import API from "./axios";

// ===========================
// GET ALL PRODUCTS
// ===========================
export const getProducts = () =>
  API.get("/products");

// ===========================
// GET SINGLE PRODUCT BY ID
// ===========================
export const getProductById = (
  id
) =>
  API.get(
    `/products/${id}`
  );

// ===========================
// ADD PRODUCT
// ===========================
export const addProduct = (
  data
) =>
  API.post(
    "/products",
    data
  );

// ===========================
// UPDATE FULL PRODUCT
// ===========================
export const updateProduct = (
  id,
  data
) =>
  API.put(
    `/products/${id}`,
    data
  );

// ===========================
// UPDATE STOCK ONLY
// ===========================
export const updateProductStock = (
  id,
  quantity
) =>
  API.put(
    `/products/${id}/stock`,
    { quantity }
  );

// ===========================
// QUICK ADD STOCK
// ===========================
export const addStock = (
  id,
  qty
) =>
  API.patch(
    `/products/${id}/add-stock`,
    { quantity: qty }
  );

// ===========================
// DELETE PRODUCT
// ===========================
export const deleteProduct = (
  id
) =>
  API.delete(
    `/products/${id}`
  );