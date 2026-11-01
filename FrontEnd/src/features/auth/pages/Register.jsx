import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury selection:bg-[#d4af37] selection:text-[#09090b]">
      {/* Editorial Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#08080a]/90 backdrop-blur-md border-b border-[#202026]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
          {/* Brand Wordmark */}
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

          {/* Minimalist Navigation */}
          <nav className="hidden lg:flex items-center space-x-10 text-[11px] font-medium tracking-[0.2em] text-[#a1a1aa] uppercase">
            <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Collections</span>
            <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Atelier</span>
            <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Archives</span>
            <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Editorial</span>
          </nav>

          {/* Right Action */}
          <div className="flex items-center space-x-6">
            <span className="hidden sm:inline-block text-[11px] font-medium tracking-[0.2em] text-[#71717a] hover:text-[#d4af37] cursor-pointer transition-colors">
              EN / USD
            </span>
            <Link
              to="/"
              className="text-[11px] font-medium tracking-[0.2em] text-[#d4af37] hover:text-[#f4f4f5] border border-[#d4af37]/40 hover:border-[#d4af37] px-4 py-2 transition-all uppercase"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Showcase */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12 lg:py-20">
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
          
          {/* Left Column: Editorial Runway Visual & Brand Heritage */}
          <section className="lg:col-span-5 xl:col-span-6 relative flex flex-col justify-between bg-[#111115] border border-[#232329] p-8 sm:p-12 overflow-hidden champagne-glow min-h-[580px] lg:min-h-[760px]">
            {/* Background Editorial Image Layer */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop"
                alt="Veyro Haute Couture Editorial"
                className="w-full h-full object-cover object-top opacity-50 filter brightness-[0.75] contrast-[1.1] transition-transform duration-1000 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/70 to-[#0d0d10]/40" />
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
                    ATELIER REGISTRY
                  </span>
                  <span className="text-[10px] text-[#71717a] tracking-widest uppercase">
                    EST. 2025
                  </span>
                </div>
              </div>

              <div className="bg-[#121216]/80 backdrop-blur-md border border-[#d4af37]/30 px-3.5 py-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                <span className="text-[9px] font-semibold tracking-[0.25em] text-[#f2ca50] uppercase">
                  RUNWAY ARCHIVE 2025
                </span>
              </div>
            </div>

            {/* Editorial Title & Statement */}
            <div className="relative z-10 my-auto py-10 max-w-lg">
              <span className="text-[11px] font-medium tracking-[0.35em] text-[#d4af37] uppercase block mb-4">
                AUTUMN / WINTER COLLECTIVE
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl xl:text-5xl text-[#f4f4f5] leading-[1.18] tracking-tight mb-6">
                Timeless Craft,<br />
                Contemporary Silhouettes.
              </h1>
              <p className="text-sm text-[#a1a1aa] leading-relaxed max-w-md font-light">
                Step into the curated realm of avant-garde haute couture. Membership unlocks private atelier allocations, bespoke fittings, and archival fashion drops.
              </p>
            </div>

            {/* Bottom Luxury Pillars Grid */}
            <div className="relative z-10 border-t border-[#27272a] pt-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-3.5 bg-[#09090b]/80 backdrop-blur-sm border border-[#27272a]">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#d4af37] block mb-1">
                    01. CURATED DROPS
                  </span>
                  <p className="text-[11px] text-[#71717a] leading-snug">
                    Guaranteed private allocation in strictly limited seasonal runway caps.
                  </p>
                </div>

                <div className="p-3.5 bg-[#09090b]/80 backdrop-blur-sm border border-[#27272a]">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#d4af37] block mb-1">
                    02. BESPOKE ATELIER
                  </span>
                  <p className="text-[11px] text-[#71717a] leading-snug">
                    Private made-to-measure tailoring and private stylist consultations.
                  </p>
                </div>

                <div className="p-3.5 bg-[#09090b]/80 backdrop-blur-sm border border-[#27272a]">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#d4af37] block mb-1">
                    03. DESIGNER GUILD
                  </span>
                  <p className="text-[11px] text-[#71717a] leading-snug">
                    Direct access to certified European heritage houses & bespoke artisans.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Seamless Registration Form Card */}
          <section className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center">
            <div className="bg-[#121216] border border-[#232329] p-8 sm:p-12 lg:p-14 champagne-glow relative">
              {/* Golden Hairline Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-90" />

              {/* Form Header with Breathing Space */}
              <header className="mb-9">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2.5 h-[1px] bg-[#d4af37]" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                    CLIENT REGISTRY
                  </span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#f4f4f5] tracking-wide mb-2.5">
                  Create Your Veyro Account
                </h2>
                <p className="text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed">
                  Enter your credentials below to enjoy curated access to bespoke collections, private presales, and confidential atelier appointments.
                </p>
              </header>

              {/* Pure Registration Form UI */}
              <form className="space-y-6">
                
                {/* Field 1: Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="fullname"
                    className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                  >
                    Full Name <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative flex items-center border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/40 transition-all duration-200">
                    <span className="pl-4 pr-3 text-[#71717a] flex items-center pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      required
                      placeholder="Julian Sterling"
                      className="w-full bg-transparent py-3.5 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light"
                    />
                  </div>
                </div>

                {/* Field 2: Email Address */}
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
                      placeholder="julian.sterling@atelier.com"
                      className="w-full bg-transparent py-3.5 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light"
                    />
                  </div>
                </div>

                {/* Field 3: Contact Number */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="contactNumber"
                      className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                    >
                      Contact Number <span className="text-[#d4af37]">*</span>
                    </label>
                    <span className="text-[9px] tracking-wider text-[#71717a] uppercase">
                      FOR CONCIERGE UPDATES
                    </span>
                  </div>
                  <div className="relative flex items-center border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/40 transition-all duration-200">
                    <span className="pl-4 pr-3 text-[#71717a] flex items-center pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-transparent py-3.5 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wider font-light"
                    />
                  </div>
                </div>

                {/* Field 4: Password with Hide/Show Toggle */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                    >
                      Password <span className="text-[#d4af37]">*</span>
                    </label>
                    <span className="text-[9px] font-medium tracking-wider text-[#71717a] uppercase">
                      MIN. 8 CHARACTERS & SYMBOLS
                    </span>
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

                {/* Field 5: isSeller Checkbox Flag */}
                <div className="pt-2">
                  <label
                    htmlFor="isSeller"
                    className="group relative flex items-start p-4 sm:p-5 border border-[#27272a] bg-[#0e0e12] hover:border-[#d4af37]/50 hover:bg-[#121217] cursor-pointer transition-all duration-300 select-none"
                  >
                    <div className="flex items-center h-5 mt-0.5 mr-4">
                      <input
                        id="isSeller"
                        name="isSeller"
                        type="checkbox"
                        className="w-4 h-4 rounded-none accent-[#d4af37] bg-[#09090b] border-[#52525b] focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[#f4f4f5] group-hover:text-[#d4af37] transition-colors">
                          Register as a Seller / Designer
                        </span>
                        <span className="text-[9px] font-semibold tracking-[0.2em] px-2 py-0.5 bg-[#1f1f26] border border-[#d4af37]/40 text-[#f2ca50] uppercase">
                          PARTNER ATELIER
                        </span>
                      </div>
                      <p className="text-[11px] text-[#a1a1aa] mt-1 leading-relaxed font-light">
                        Apply to showcase, curate, and retail your verified haute couture collections across Veyro’s international salons and exclusive private client network.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[#f2ca50] hover:shadow-[0_0_30px_rgba(242,202,80,0.35)] active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>CREATE ACCOUNT</span>
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

                {/* Form Footer */}
                <div className="pt-2 text-center space-y-4">
                  <p className="text-xs text-[#a1a1aa] font-light">
                    Already hold an archival membership?{' '}
                    <Link
                      to="/"
                      className="text-[#d4af37] hover:text-[#f2ca50] font-medium underline underline-offset-4 transition-colors ml-1"
                    >
                      Sign In
                    </Link>
                  </p>

                  <div className="border-t border-[#232329] pt-4">
                    <p className="text-[10px] text-[#71717a] leading-relaxed max-w-md mx-auto">
                      By creating an account, you affirm compliance with VEYRO’s{' '}
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

      {/* Luxury Atelier Footer */}
      <footer className="w-full bg-[#08080a] border-t border-[#1e1e24] py-8 px-6 sm:px-10 lg:px-16 mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-serif-luxury text-lg tracking-[0.2em] text-[#f4f4f5] uppercase select-none">
              VEYRO
            </span>
            <span className="text-[11px] text-[#71717a] tracking-wider">
              © {new Date().getFullYear()} VEYRO ATELIER. ALL RIGHTS RESERVED. ARCHIVAL PRESERVATION & CURATION.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-medium tracking-[0.2em] text-[#a1a1aa] uppercase">
            <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Client Service</span>
            <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Legal & Regulatory</span>
            <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Privacy Protocol</span>
            <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Bespoke Inquiries</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
