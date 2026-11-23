import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return (
      <>
        <div>Loading .......</div>
      </>
    );
  }
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
export default ProtectedRoute;
