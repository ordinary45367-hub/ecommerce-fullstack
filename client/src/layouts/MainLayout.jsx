import { Outlet } from "react-router";
import Navbar from "../components/layout/Navbar";
function MainLayout({ cart, handleInputSearch }) {
  return (
    <>
      <Navbar cart={cart} onInputSearch={handleInputSearch} />
      <Outlet />
    </>
  );
}
export default MainLayout;
