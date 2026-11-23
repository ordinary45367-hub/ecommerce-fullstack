import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { baseURL } from "../../../../utils/constants";
import { addToCart } from "../../../../services/cartServices";
import { useCart } from "../../../../context/cartContext";
import { useAuth } from "../../../../context/AuthContext";
import "./ProductGrid.css";
function ProductGrid({ products }) {
  const [addMessage, setAddMessage] = useState(false);
  const [productId, setProductId] = useState(null);
  const timerRef = useRef(null);
  const { refreshCarts } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function addTocartButton(product) {
    console.log(product);

    await addToCart(product.id, 1);
    await refreshCarts();
    setAddMessage(true);
    setProductId(product.id);

    setTimeout(() => {
      setAddMessage(false);
    }, 2000);
  }

  return (
    <>
      <section className="product-grid ">
        {products.map((product) => {
          return (
            <figure key={product.id}>
              <img src={`${baseURL + product?.images[0]?.imageUrl}`} alt="" />

              <figcaption>
                <b>{product?.name}</b>
                <br />
                {product.description}
                <br />
                {"Available Quantity : " + product.stockQuantity}
                {/* <br />
                  <small>Avialable quantity: {product?.stockQuantity}</small> */}
                <p className="product-price">${product?.price}</p>
                {/* {productId === product.id && (
                  <p
                    className={`js-added-to-cart-message ${productId === product.id ? " js-added-to-cart-message-show" : ""}`}
                  >
                    Added
                  </p>
                )} */}
                <button
                  onClick={
                    !isAuthenticated
                      ? () => {
                          navigate("/login");
                        }
                      : () => {
                          addTocartButton(product);
                        }
                  }
                  className="btn btn-success w-100"
                >
                  Add to Cart
                </button>
              </figcaption>
            </figure>
          );
        })}
      </section>
    </>
  );
}
export default ProductGrid;
