import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Requires the user to be logged in.
 * If not, redirects to /login.
 */
export function AuthRoute() {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/**
 * Requires the user to be logged in AND registered as a seller.
 * If not logged in  → /login
 * If logged in but not a seller → /unauthorized
 */
export function SellerRoute() {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  const isSeller = Boolean(user.role === "seller" || user.isSeller === true);
  if (!isSeller) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}

/**
 * Prevents already-authenticated users from accessing auth pages (login/register).
 * If logged in → redirect to home or seller dashboard based on role.
 */
export function GuestRoute() {
  const user = useSelector((state) => state.auth.user);
  if (user) {
    const isSeller = Boolean(user.role === "seller" || user.isSeller === true);
    return <Navigate to={isSeller ? "/products/create" : "/"} replace />;
  }
  return <Outlet />;
}
