import { useEffect } from "react";
import { useLocation } from "react-router";
function ScrolllToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("pathname : " + pathname);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  return null;
}
export default ScrolllToTop;
