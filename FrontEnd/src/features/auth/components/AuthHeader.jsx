import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../state/auth.slice";

export default function AuthHeader({ actionLabel, actionTo }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSeller = Boolean(user && (user.role === "seller" || user.isSeller === true));

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08080a]/95 backdrop-blur-md border-b border-[#202026]">
      <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-4">
          <Link
            to={isSeller ? "/dashboard" : "/"}
            className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] text-[#f4f4f5] hover:text-[#d4af37] transition-colors uppercase select-none"
          >
            VEYRO
          </Link>
          <span className="hidden md:inline-block text-[10px] font-medium tracking-[0.25em] text-[#71717a] border-l border-[#27272a] pl-4">
            {isSeller ? "ATELIER SELLER PORTAL" : "HAUTE COUTURE ARCHIVE"}
          </span>
        </div>

        {/* Role-Specific Navigation Menu: Totally separate for Buyer vs Seller */}
        <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-medium tracking-[0.2em] uppercase">
          {isSeller ? (
            /* Seller-only navigation options */
            <>
              <Link to="/dashboard" className="text-[#d4af37] hover:text-[#f2ca50] transition-colors">
                Seller Dashboard
              </Link>
              <Link to="/products/create" className="text-[#f2ca50] hover:text-[#d4af37] transition-colors flex items-center gap-1">
                <span>+ New Creation</span>
              </Link>
              <span className="text-[#71717a] cursor-default">Atelier Ledger</span>
            </>
          ) : (
            /* Buyer / Client navigation options - ZERO seller links */
            <>
              <a href="/#collections" className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
                Collections
              </a>
              <a href="/#vault" className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
                Archival Vault
              </a>
              <a href="/#salon" className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
                Private Salon
              </a>
              <a href="/#concierge" className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
                Concierge
              </a>
            </>
          )}
        </nav>

        {/* User controls / Auth actions */}
        <div className="flex items-center space-x-5">
          <span className="hidden sm:inline-block text-[11px] font-medium tracking-[0.2em] text-[#71717a] hover:text-[#d4af37] cursor-pointer transition-colors">
            EN / USD
          </span>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Distinct Badge: Seller vs Buyer Client */}
              {isSeller ? (
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-[#09090b] bg-[#d4af37] uppercase">
                  Partner Atelier
                </span>
              ) : (
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[9px] font-semibold tracking-widest text-[#d4af37] border border-[#d4af37]/40 uppercase bg-[#121216]">
                  Private Client
                </span>
              )}

              <span className="text-[11px] text-[#f4f4f5] tracking-wider hidden md:inline-block font-light">
                {user.fullname?.split(" ")[0] || (isSeller ? "Seller" : "Client")}
              </span>

              <button
                type="button"
                onClick={handleSignOut}
                className="text-[11px] font-medium tracking-[0.2em] text-[#71717a] hover:text-[#ffb4ab] border border-[#27272a] hover:border-[#ffb4ab]/40 px-3 py-1.5 transition-all uppercase cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : actionLabel && actionTo ? (
            <Link
              to={actionTo}
              className="text-[11px] font-medium tracking-[0.2em] text-[#d4af37] hover:text-[#09090b] hover:bg-[#d4af37] border border-[#d4af37]/60 px-4 py-2 transition-all uppercase"
            >
              {actionLabel}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-[11px] font-medium tracking-[0.2em] text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#27272a] hover:border-[#d4af37]/40 px-3.5 py-1.5 transition-all uppercase"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-[11px] font-medium tracking-[0.2em] text-[#09090b] bg-[#d4af37] hover:bg-[#f2ca50] px-3.5 py-1.5 transition-all uppercase font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
