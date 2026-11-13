import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/** Full-screen loading shimmer shown while session is being validated */
function SessionLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "#08080a" }}>
      <div className="flex flex-col items-center gap-6">
        {/* Animated champagne gold ring */}
        <div
          className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: "#d4af37",
            borderRightColor: "#d4af37",
          }}
        />
        <p className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "#d4af37", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Authenticating
        </p>
      </div>
    </div>
  );
}

/**
 * Requires the user to be logged in.
 * Waits for server-side session validation before redirecting.
 */
export function AuthRoute() {
  const { user, sessionValidated } = useSelector((state) => state.auth);
  if (!sessionValidated) return <SessionLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/**
 * Requires the user to be logged in AND registered as a seller.
 * Waits for server-side session validation before redirecting.
 * If not logged in  → /login
 * If logged in but not a seller → /unauthorized
 */
export function SellerRoute() {
  const { user, sessionValidated } = useSelector((state) => state.auth);
  if (!sessionValidated) return <SessionLoader />;
  if (!user) return <Navigate to="/login" replace />;
  const isSeller = Boolean(user.role === "seller" || user.isSeller === true);
  if (!isSeller) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}

/**
 * Prevents already-authenticated users from accessing auth pages (login/register).
 * Waits for server-side session validation so we don't flash-redirect.
 */
export function GuestRoute() {
  const { user, sessionValidated } = useSelector((state) => state.auth);
  if (!sessionValidated) return <SessionLoader />;
  if (user) {
    const isSeller = Boolean(user.role === "seller" || user.isSeller === true);
    return <Navigate to={isSeller ? "/dashboard" : "/"} replace />;
  }
  return <Outlet />;
}
