import { Link } from "react-router";
import { baseURL } from "../../../../utils/constants";
import {
  updateCartItem,
  deleteCartItem,
} from "../../../../services/cartServices";
import { useCart } from "../../../../context/cartContext";
import "../Cart.css";

function CartSummary() {
  const { cart, refreshCarts, isCartLoading } = useCart();

  async function increaseQuantity(cart) {
    const newQuantity = cart?.quantity + 1;
    await updateCartItem(cart?.id, newQuantity);
    await refreshCarts();
  }

  async function decreaseQuantity(cart) {
    const newQuantity = cart?.quantity - 1;
    await updateCartItem(cart?.id, newQuantity);
    await refreshCarts();
  }
  async function deleteCartItems(cart) {
    await deleteCartItem(cart?.id);
    await refreshCarts();
  }
  if (!cart || cart.length === 0 || isCartLoading) {
    return (
      <section>
        <p>OOPs! your cart is empty browse product</p>
        <Link to="/" className="btn btn-success">
          View Product
        </Link>
      </section>
    );
  }
  return (
    <div className="cart-items">
      <div className="cart-table-title">
        <div>Product</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Total</div>
      </div>

      {cart.map((cart) => {
        return (
          <div className="cart-item" key={cart.id}>
            <div className="product-info">
              <img
                src={`${baseURL + cart?.product?.images[0]?.imageUrl}`}
                alt="Men's T-Shirt"
              />
              <span>{cart?.product?.name}</span>
            </div>

            <div className="product-price">${cart?.product?.price}</div>

            <div className="quantity-wrapper">
              <button
                type="button"
                onClick={() => {
                  decreaseQuantity(cart);
                }}
              >
                -
              </button>
              <span>{cart?.quantity}</span>
              <button
                type="button"
                onClick={() => {
                  increaseQuantity(cart);
                }}
              >
                +
              </button>
            </div>

            <div className="product-total">
              <span>${(cart?.quantity * cart?.product?.price).toFixed(2)}</span>
              <i
                onClick={() => {
                  deleteCartItems(cart);
                }}
                className="fa-solid fa-trash delete-icon"
              ></i>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CartSummary;
