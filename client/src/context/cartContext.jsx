import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
const CartContext = createContext(null);
import { fetchCarts } from "../services/cartServices";
import { useAuth } from "./AuthContext";
export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  const refreshCarts = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      setIsCartLoading(false);
      return;
    }

    try {
      const data = await fetchCarts();
      setCart(data?.cart?.items || []);
    } catch (error) {
      console.error("Failed to fetch carts:", error);
    } finally {
      setIsCartLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    refreshCarts();
  }, [refreshCarts]);

  return (
    <CartContext.Provider value={{ cart, isCartLoading, refreshCarts }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => {
  return useContext(CartContext);
};
