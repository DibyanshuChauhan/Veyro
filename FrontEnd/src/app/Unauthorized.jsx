import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthHeader from "../features/auth/components/AuthHeader";
import AuthFooter from "../features/auth/components/AuthFooter";

export default function Unauthorized() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury selection:bg-[#d4af37] selection:text-[#09090b]">
      <AuthHeader actionLabel="Sign In" actionTo="/login" />

      <main className="grow flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md space-y-6">
          {/* Gold accent line */}
          <div className="flex justify-center mb-6">
            <span className="w-12 h-px bg-[#d4af37]" />
          </div>

          <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
            Access Restricted
          </span>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#f4f4f5] leading-tight tracking-tight">
            Seller Portal Only
          </h1>

          <p className="text-sm text-[#a1a1aa] font-light leading-relaxed">
            {user
              ? "Your account is not registered as a seller. To list creations on VEYRO, please register as a Partner Atelier."
              : "You must be signed in as a registered seller to access this area."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {!user ? (
              <Link
                to="/register"
                className="py-3.5 px-8 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#f2ca50] transition-all duration-300"
              >
                Register as Seller
              </Link>
            ) : null}
            <Link
              to="/"
              className="py-3.5 px-8 border border-[#27272a] text-[#a1a1aa] text-[11px] font-semibold tracking-[0.22em] uppercase hover:border-[#d4af37]/50 hover:text-[#f4f4f5] transition-all duration-300"
            >
              Return to Archive
            </Link>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}

