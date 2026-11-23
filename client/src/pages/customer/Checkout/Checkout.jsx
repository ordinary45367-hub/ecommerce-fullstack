import ShppingAddress from "./components/ShppingAddress";
import OrderSummary from "../Cart/components/OrderSummary";
import "./Checkout.css";
function Checkout({ cart }) {
  return (
    <>
      <section className="checkout-container d-flex flex-lg-row flex-column">
        <ShppingAddress />
        <OrderSummary checkout cart={cart} />
      </section>
    </>
  );
}
export default Checkout;
