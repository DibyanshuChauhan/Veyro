import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../hook/useAuth";
import GoogleCallback from '../components/GoogleCallback';
import AuthHeader from "../components/AuthHeader";
import AuthFooter from "../components/AuthFooter";

export default function Login() {

  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email: formData.email, password: formData.password });    
    console.log("Submitting Login UI Data:", formData);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury selection:bg-[#d4af37] selection:text-[#09090b]">
      <AuthHeader actionLabel="Register" actionTo="/register" />

      {/* Main Login Showcase */}
      <main className="grow flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12 lg:py-20">
        <div className="w-full max-w-340 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">

          {/* Left Column: Editorial Runway Visual & Brand Heritage */}
          <section className="lg:col-span-5 xl:col-span-6 relative flex flex-col justify-between bg-[#111115] border border-[#232329] p-8 sm:p-12 overflow-hidden champagne-glow min-h-145 lg:min-h-190">
            {/* Background Editorial Image Layer */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop"
                alt="Veyro Haute Couture Atelier"
                className="w-full h-full object-cover object-top opacity-50 filter brightness-[0.75] contrast-[1.1] transition-transform duration-1000 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0d0d10] via-[#0d0d10]/70 to-[#0d0d10]/40" />
              <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-[130px] pointer-events-none" />
            </div>

            {/* Top Monogram & Runway Credential */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center space-x-3.5">
                <span className="inline-flex items-center justify-center w-9 h-9 border border-[#d4af37] text-[#d4af37] font-serif-luxury text-lg">
                  V
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                    CLIENT PORTAL
                  </span>
                  <span className="text-[10px] text-[#71717a] tracking-widest uppercase">
                    EST. 2025
                  </span>
                </div>
              </div>

              <div className="bg-[#121216]/80 backdrop-blur-md border border-[#d4af37]/30 px-3.5 py-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                <span className="text-[9px] font-semibold tracking-[0.25em] text-[#f2ca50] uppercase">
                  PRIVATE SALON ACCESS
                </span>
              </div>
            </div>

            {/* Editorial Title & Statement */}
            <div className="relative z-10 my-auto py-10 max-w-lg">
              <span className="text-[11px] font-medium tracking-[0.35em] text-[#d4af37] uppercase block mb-4">
                AUTUMN / WINTER COLLECTIVE
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl xl:text-5xl text-[#f4f4f5] leading-[1.18] tracking-tight mb-6">
                Welcome to the <br />
                <span className="italic font-light text-[#f2ca50]">Private Archives.</span>
              </h1>
              <p className="text-sm text-[#a1a1aa] leading-relaxed max-w-md font-light">
                Authenticate your membership to access confidential atelier allocations, private fittings, curated acquisitions, and high-fashion runway vaults.
              </p>
            </div>

            {/* Bottom Luxury Pillars Grid */}
            <div className="relative z-10 border-t border-[#27272a] pt-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-3.5 bg-[#09090b]/80 backdrop-blur-sm border border-[#27272a]">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#d4af37] block mb-1">
                    01. PRIVATE VAULT
                  </span>
                  <p className="text-[11px] text-[#71717a] leading-snug">
                    Access strictly limited seasonal capsule drops and bespoke salon reservations.
                  </p>
                </div>

                <div className="p-3.5 bg-[#09090b]/80 backdrop-blur-sm border border-[#27272a]">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#d4af37] block mb-1">
                    02. BESPOKE SALON
                  </span>
                  <p className="text-[11px] text-[#71717a] leading-snug">
                    Direct liaison with European heritage tailors and confidential stylists.
                  </p>
                </div>

                <div className="p-3.5 bg-[#09090b]/80 backdrop-blur-sm border border-[#27272a]">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#d4af37] block mb-1">
                    03. CONCIERGE ACCESS
                  </span>
                  <p className="text-[11px] text-[#71717a] leading-snug">
                    Priority white-glove international shipping and archival care management.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Seamless Login Form Card */}
          <section className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center">
            <div className="bg-[#121216] border border-[#232329] p-8 sm:p-12 lg:p-14 champagne-glow relative">
              {/* Golden Hairline Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#d4af37] to-transparent opacity-90" />

              {/* Form Header */}
              <header className="mb-9">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2.5 h-px bg-[#d4af37]" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                    CLIENT AUTHENTICATION
                  </span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#f4f4f5] tracking-wide mb-2.5">
                  Access Your Portal
                </h2>
                <p className="text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed">
                  Enter your verified archival credentials to access your private salon inventory, confidential orders, and bespoke commissions.
                </p>
              </header>

              {/* Pure Login Form UI */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Field 1: Email Address */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                  >
                    Email Address <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative flex items-center border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/40 transition-all duration-200">
                    <span className="pl-4 pr-3 text-[#71717a] flex items-center pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="client@atelier-veyro.com"
                      className="w-full bg-transparent py-3.5 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light"
                    />
                  </div>
                </div>

                {/* Field 2: Password with Hide/Show Toggle */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                    >
                      Password <span className="text-[#d4af37]">*</span>
                    </label>
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="text-[9px] font-medium tracking-wider text-[#d4af37] hover:text-[#f2ca50] hover:underline underline-offset-4 uppercase transition-colors"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <div className="relative flex items-center border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/40 transition-all duration-200">
                    <span className="pl-4 pr-3 text-[#71717a] flex items-center pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••••••"
                      className="w-full bg-transparent py-3.5 pr-11 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wider font-light"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3.5 text-[#71717a] hover:text-[#d4af37] transition-colors p-1"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Session Checkbox */}
                <div className="pt-1">
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded-none accent-[#d4af37] bg-[#09090b] border-[#52525b] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-[#a1a1aa] group-hover:text-[#f4f4f5] transition-colors font-light">
                      Remember archival session on this device
                    </span>
                  </label>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[#f2ca50] hover:shadow-[0_0_30px_rgba(242,202,80,0.35)] active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>SIGN IN TO ATELIER</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                {/* Google Authentication Button */}
                <a className="pt-1 block" href="/api/auth/google">
                  <GoogleCallback showDivider dividerText="OR CONTINUE WITH" text="Continue with Google" />
                </a>

                {/* Form Footer */}
                <div className="pt-2 text-center space-y-4">
                  <p className="text-xs text-[#a1a1aa] font-light">
                    New to the archival collective?{' '}
                    <Link
                      to="/register"
                      className="text-[#d4af37] hover:text-[#f2ca50] font-medium underline underline-offset-4 transition-colors ml-1"
                    >
                      Register for Membership
                    </Link>
                  </p>

                  <div className="border-t border-[#232329] pt-4">
                    <p className="text-[10px] text-[#71717a] leading-relaxed max-w-md mx-auto">
                      Protected by 256-bit Archival Cryptography. By authenticating, you affirm compliance with VEYRO’s{' '}
                      <span className="underline hover:text-[#d4af37] cursor-pointer transition-colors">Terms of Service</span>,{' '}
                      <span className="underline hover:text-[#d4af37] cursor-pointer transition-colors">Privacy Protocol</span>, and{' '}
                      <span className="underline hover:text-[#d4af37] cursor-pointer transition-colors">Atelier Code of Ethics</span>.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}

