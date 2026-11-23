export const baseURL = "http://localhost:3000/";
export function calculateCartItemQuantity(cart) {
  const subTotal =
    cart?.reduce((total, item) => {
      const price = Number(item?.product?.price || 0);
      const quantity = Number(item?.quantity || 0);
      return total + price * quantity;
    }, 0) || 0;

  return subTotal;
}
