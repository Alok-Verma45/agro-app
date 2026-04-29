import API from "./axios";

// 🛒 GET CART
export const getCart = () => {
  return API.get("/cart");
};

// ➕ ADD TO CART
export const addToCart = (productId, quantity = 1) => {
  return API.post("/cart/add", null, {
    params: { productId, quantity },
  });
};

// ❌ REMOVE ITEM
export const removeItem = (itemId) => {
  return API.delete(`/cart/item/${itemId}`);
};

// 🔄 UPDATE QUANTITY
export const updateQuantity = (itemId, quantity) => {
  return API.put(`/cart/item/${itemId}`, null, {
    params: { quantity },
  });
};