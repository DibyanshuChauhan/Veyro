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
    <header className="sticky top-0 z-50 w-full bg-[#08080a]/90 backdrop-blur-md border-b border-[#202026]">
      <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] text-[#f4f4f5] hover:text-[#d4af37] transition-colors uppercase select-none"
          >
            VEYRO
          </Link>
          <span className="hidden md:inline-block text-[10px] font-medium tracking-[0.25em] text-[#71717a] border-l border-[#27272a] pl-4">
            HAUTE COUTURE ARCHIVE
          </span>
        </div>

        <nav className="hidden lg:flex items-center space-x-10 text-[11px] font-medium tracking-[0.2em] text-[#a1a1aa] uppercase">
          <Link to="/" className="hover:text-[#f4f4f5] transition-colors">Collections</Link>
          {isSeller && (
            <Link to="/products/create" className="text-[#d4af37] hover:text-[#f2ca50] transition-colors flex items-center gap-1.5">
              <span>+ Create Product</span>
            </Link>
          )}
          <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Atelier</span>
          <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Archives</span>
          <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Editorial</span>
        </nav>

        <div className="flex items-center space-x-5">
          <span className="hidden sm:inline-block text-[11px] font-medium tracking-[0.2em] text-[#71717a] hover:text-[#d4af37] cursor-pointer transition-colors">
            EN / USD
          </span>

          {user ? (
            <div className="flex items-center gap-3">
              {isSeller && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-semibold tracking-wider text-[#d4af37] border border-[#d4af37]/30 uppercase bg-[#121216]">
                  Seller
                </span>
              )}
              <span className="text-[11px] text-[#f4f4f5] tracking-wider hidden md:inline-block">
                {user.fullname?.split(" ")[0] || "Client"}
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
              className="text-[11px] font-medium tracking-[0.2em] text-[#d4af37] hover:text-[#f4f4f5] border border-[#d4af37]/40 hover:border-[#d4af37] px-4 py-2 transition-all uppercase"
            >
              {actionLabel}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-[11px] font-medium tracking-[0.2em] text-[#d4af37] hover:text-[#f4f4f5] border border-[#d4af37]/40 hover:border-[#d4af37] px-4 py-2 transition-all uppercase"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
