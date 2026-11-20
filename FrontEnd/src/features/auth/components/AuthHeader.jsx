import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useCart } from "../../cart/hook/useCart";
import CartToast from "../../cart/components/CartToast";

export default function AuthHeader({ actionLabel, actionTo }) {
  const { user, isSeller, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { totalItems, handleGetCart } = useCart();

  useEffect(() => {
    if (user && !isSeller) {
      handleGetCart();
    }
  }, [user, isSeller, handleGetCart]);

  const handleSignOut = async () => {
    await handleLogout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleSectionClick = (e, sectionId) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${sectionId}`);
      }
    }
    setMobileMenuOpen(false);
  };

  const isSellerDashboard = location.pathname === "/dashboard" || location.pathname === "/seller/dashboard";
  const isCreateProduct = location.pathname === "/products/create";

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

        {/* Desktop Navigation Menu: Only working and required links */}
        <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-medium tracking-[0.2em] uppercase">
          {isSeller ? (
            /* Seller-only navigation options */
            <>
              <Link
                to="/dashboard"
                className={`transition-colors ${
                  isSellerDashboard
                    ? "text-[#d4af37]"
                    : "text-[#a1a1aa] hover:text-[#f2ca50]"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/products/create"
                className={`transition-colors flex items-center gap-1.5 ${
                  isCreateProduct
                    ? "text-[#d4af37]"
                    : "text-[#a1a1aa] hover:text-[#d4af37]"
                }`}
              >
                <span>+ New Creation</span>
              </Link>
            </>
          ) : (
            /* Buyer / Client navigation options */
            <>
              <a
                href="/#vault"
                onClick={(e) => handleSectionClick(e, "vault")}
                className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
              >
                Archival Vault
              </a>
              <a
                href="/#salon"
                onClick={(e) => handleSectionClick(e, "salon")}
                className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
              >
                Private Salon
              </a>
            </>
          )}
        </nav>

        {/* User controls / Auth actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Cart Trigger for Buyers / Clients: Links directly to dedicated /cart page */}
          {!isSeller && (
            <Link
              to="/cart"
              className="relative p-2 text-[#a1a1aa] hover:text-[#f2ca50] transition-colors cursor-pointer flex items-center justify-center group"
              title="View Archival Bag"
              aria-label="View Archival Bag"
            >
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#d4af37] text-[#09090b] text-[9px] font-bold flex items-center justify-center font-mono leading-none shadow-[0_0_10px_rgba(212,175,55,0.6)]">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

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

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#27272a] hover:border-[#d4af37] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu: Displays the same working links on smaller screens */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c10] border-t border-[#202026] px-6 py-4 space-y-3">
          {isSeller ? (
            <div className="flex flex-col space-y-3 text-[11px] font-medium tracking-[0.2em] uppercase">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 ${isSellerDashboard ? "text-[#d4af37]" : "text-[#a1a1aa] hover:text-[#f4f4f5]"}`}
              >
                Dashboard
              </Link>
              <Link
                to="/products/create"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 flex items-center gap-1.5 ${isCreateProduct ? "text-[#d4af37]" : "text-[#a1a1aa] hover:text-[#d4af37]"}`}
              >
                <span>+ New Creation</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 text-[11px] font-medium tracking-[0.2em] uppercase">
              <a
                href="/#vault"
                onClick={(e) => handleSectionClick(e, "vault")}
                className="py-1 text-[#a1a1aa] hover:text-[#f4f4f5]"
              >
                Archival Vault
              </a>
              <a
                href="/#salon"
                onClick={(e) => handleSectionClick(e, "salon")}
                className="py-1 text-[#a1a1aa] hover:text-[#f4f4f5]"
              >
                Private Salon
              </a>
            </div>
          )}
        </div>
      )}

      {/* Haute Couture Toast Notification (Replaces intrusive drawer popup) */}
      <CartToast />
    </header>
  );
}
