import { Link } from "react-router";
import CartSummary from "./components/CartSummary";
import OrderSummary from "./components/OrderSummary";
import { useCart } from "../../../context/cartContext";
import "./Cart.css";
function Carts() {
  const { cart, isCartLoading } = useCart();

  if (isCartLoading)
    return (
      <h1 style={{ margin: "0 auto", marginTop: "300px", marginLeft: "150px" }}>
        Loading Products
      </h1>
    );

  return (
    <>
      <section className="carts-section">
        <div className="heading-wrapper d-flex align-items-center justify-content-between px-5">
          <div className="d-flex gap-3 align-items-center">
            <i className="fa-solid fa-cart-shopping"></i>
            <p>Your Cart</p>
          </div>
          <Link className="d-flex align-items-center gap-2" to="/">
            <span>Continue Shopping</span>
            <i className="fa-solid fa-arrow-right arrow-icon"></i>
          </Link>
        </div>
        <div
          className="summary 
        "
        >
          {/* cart summary */}
          <CartSummary cart={cart} />

          {/* order summary */}
          <OrderSummary cart={cart} />
        </div>
      </section>
    </>
  );
}
export default Carts;
