import { Link } from "react-router";
import { calculateCartItemQuantity } from "../../../../utils/constants";
import { useCart } from "../../../../context/cartContext";
import "../Cart.css";
function OrderSummary({ checkout }) {
  const { cart } = useCart();

  const subTotal = calculateCartItemQuantity(cart);

  const shipping = subTotal > 0 ? 5.6 : 0;
  const totalPrice = (subTotal + shipping).toFixed(2);
  const formattedSubTotal = subTotal.toFixed(2);
  return (
    <>
      {" "}
      <div className="order-summary">
        <div className="top">Order Summary</div>

        <div className="middle">
          <div className="price-container">
            <span className="bold">Subtotal:</span>
            <span>${formattedSubTotal}</span>
          </div>
          <div className="price-container">
            <span>Shipping:</span>
            <span>$5.60</span>
          </div>
        </div>

        <div className="bottom">
          <div className="price-container">
            <span className="total-price">Total:</span>
            <span>${totalPrice}</span>
          </div>
          <Link className={`${checkout && "d-none"}`} to="/checkout">
            <button className="btn btn-success w-100">Place your order</button>
          </Link>
        </div>
      </div>
    </>
  );
}
export default OrderSummary;
