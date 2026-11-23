import { Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/customer/Home/Home";
import Carts from "../pages/customer/Cart/Cart";
import Checkout from "../pages/customer/Checkout/Checkout";
import Signup from "../pages/customer/Signup";
import Login from "../pages/customer/Login";
import { fetchProducts } from "../services/productServices";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { useAuth } from "../context/AuthContext";
function AppRoute() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [search, setSearch] = useState("");

  function handleSelectedCategory(category) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    setSelectedCategory(category);
  }
  function handleInputSearch(input) {
    setSearch(input);
  }
  useEffect(() => {
    const loadCartsAndProducts = async () => {
      try {
        const product = await fetchProducts(selectedCategory, search);
        setProducts(product?.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCartsAndProducts();
  }, [selectedCategory, search]);

  return (
    <Routes>
      <Route
        path="/"
        element={<MainLayout handleInputSearch={handleInputSearch} />}
      >
        <Route
          index
          element={
            <HomePage
              handleSelectedCategory={handleSelectedCategory}
              products={products}
              loading={loading}
            />
          }
        />
        <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
          <Route path="carts" element={<Carts />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}
export default AppRoute;
