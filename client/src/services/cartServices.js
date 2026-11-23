import api from "./api";
export async function fetchCarts() {
  const res = await api.get(`/api/cart`, { withCredentials: true });

  return res.data;
}
export async function addToCart(productId, quantity) {
  const res = await api.post(`/api/cart/items`, {
    productId: productId,
    quantity: quantity,
  });
  return res.data;
}
export async function updateCartItem(itemId, quantity) {
  const res = await api.patch(`/api/cart/items/${itemId}`, {
    quantity: quantity,
  });
  return res.data;
}
export async function deleteCartItem(itemId) {
  const res = await api.delete(`/api/cart/items/${itemId}`);
  return res.data;
}
