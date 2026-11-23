// import { Link, useNavigate } from "react-router";
// import { useRef, useState } from "react";
// import cartIcon from "../../assets/images/cart-icon.png";
// import { useAuth } from "../../context/AuthContext";
// import { useCart } from "../../context/cartContext";
// import "./Navbar.css";

// function Navbar({ onInputSearch }) {
//   const navigate = useNavigate();
//   const inputRef = useRef(null);
//   const { user, logout, isAuthenticated } = useAuth();
//   const { cart } = useCart();
//   const [imgError, setImgError] = useState(false);

//   function searchProduct(e) {
//     onInputSearch(e.target.value);
//   }

//   async function handleLogout() {
//     await logout();
//     navigate("/login", { replace: true });
//   }

//   const quantity =
//     cart?.reduce((total, item) => {
//       return total + Number(item?.quantity || 0);
//     }, 0) || 0;

//   const userAvatar = user?.thumbnail;

//   return (
//     <nav>
//       <div className="rigth-section">
//         <div>
//           <Link to="/">
//             Shop <span>Easy</span>
//           </Link>
//         </div>
//         <div>{user && user.name}</div>
//       </div>

//       <div className="middle-section">
//         <input
//           ref={inputRef}
//           onChange={searchProduct}
//           placeholder="Search products..."
//           type="text"
//         />
//         <button aria-label="Search">
//           <i className="fa-solid fa-magnifying-glass"></i>
//         </button>
//       </div>

//       <div className="left-section">
//         {isAuthenticated ? (
//           <button
//             type="button"
//             onClick={handleLogout}
//             className="btn btn-danger btn-sm"
//           >
//             Logout
//           </button>
//         ) : (
//           <Link to="/login" className="btn btn-success ">
//             Login
//           </Link>
//         )}

//         {/* User profile thumbnail + name */}
//         {isAuthenticated && (
//           <>
//             {" "}
//             <Link to="/carts" className="cart-link">
//               <img src={cartIcon} alt="cart icon" />
//               <span className="cart-quantity">{quantity}</span>
//               <span>Cart</span>
//             </Link>
//             <div className="user-profile ms-3">
//               {userAvatar && !imgError && (
//                 <img
//                   src={userAvatar}
//                   alt={user?.name || "User"}
//                   referrerPolicy="no-referrer"
//                   onError={() => setImgError(true)}
//                   className="user-avatar"
//                 />
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { Link, useNavigate } from "react-router";
import { useState } from "react";

import cartIcon from "../../assets/images/cart-icon.png";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/cartContext";

import "./Navbar.css";

// Reusable search component
function SearchBar({ value, onChange, onSearch, mobile = false }) {
  return (
    <form
      className={`search-box ${mobile ? "mobile-search-box" : "desktop-search-box"}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
      />

      <button type="submit" aria-label="Search">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
}

function Navbar({ onInputSearch }) {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();

  const [searchValue, setSearchValue] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Calculate total cart quantity
  const quantity =
    cart?.reduce((total, item) => total + Number(item?.quantity || 0), 0) || 0;

  // Search products
  function handleSearch(value) {
    setSearchValue(value);
    onInputSearch?.(value);
  }

  // Submit search
  function submitSearch() {
    onInputSearch?.(searchValue);
  }

  // Logout
  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  // User avatar
  const userAvatar = user?.thumbnail;
  const initials = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <Link to="/">
            Shop <span>Easy</span>
          </Link>
        </div>

        {/* Desktop Search */}
        <SearchBar
          value={searchValue}
          onChange={handleSearch}
          onSearch={submitSearch}
        />

        {/* Mobile Search Toggle */}
        <button
          type="button"
          className="mobile-search-toggle"
          onClick={() => setMobileSearch(!mobileSearch)}
          aria-label="Toggle search"
          aria-expanded={mobileSearch}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Login / Logout */}
          {isAuthenticated ? (
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}

          {/* Cart */}
          {isAuthenticated && (
            <Link to="/carts" className="navbar-cart">
              <div className="cart-icon-wrapper">
                <img src={cartIcon} alt="" />

                {quantity > 0 && (
                  <span className="cart-badge">
                    {quantity > 99 ? "99+" : quantity}
                  </span>
                )}
              </div>

              <span className="cart-label">Cart</span>
            </Link>
          )}

          {/* Profile */}
          {isAuthenticated && (
            <Link to="/profile" className="navbar-profile">
              {userAvatar && !imgError ? (
                <img
                  key={userAvatar}
                  src={userAvatar}
                  alt={user?.name || "User"}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="avatar-fallback">{initials}</span>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      {mobileSearch && (
        <div className="mobile-search-container">
          <SearchBar
            mobile
            value={searchValue}
            onChange={handleSearch}
            onSearch={submitSearch}
          />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
