import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import { useAuth } from "../../auth/hook/useAuth";
import AuthHeader from "../../auth/components/AuthHeader";
import AuthFooter from "../../auth/components/AuthFooter";

/**
 * Dedicated Archival Cart Page
 * Full-screen haute couture acquisition ledger displaying all curated garments,
 * detailed variant specifications, unit valuations, and appraisal breakdowns.
 */
export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    totalAmount,
    totalItems,
    loading,
    error,
    handleGetCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleClearCart
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      handleGetCart();
    }
  }, [user, handleGetCart]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "VEYRO10") {
      setPromoApplied(true);
      setPromoDiscount(Math.round(totalAmount * 0.1));
    } else {
      alert("Invalid Archival Salon Code. Try 'VEYRO10' for 10% atelier courtesy privilege.");
    }
  };

  const finalValuation = Math.max(0, totalAmount - promoDiscount);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutSuccess(true);
    setTimeout(async () => {
      await handleClearCart();
      setCheckoutSuccess(false);
      setCheckoutModalOpen(false);
      navigate("/");
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury selection:bg-[#d4af37] selection:text-[#09090b]">
      <AuthHeader />

      <main className="grow max-w-360 w-full mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#202026]">
          <nav className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-[#71717a] uppercase">
            <Link to="/" className="hover:text-[#d4af37] transition-colors">
              Archive
            </Link>
            <span className="text-[#2e2e35]">/</span>
            <Link to="/#vault" className="hover:text-[#d4af37] transition-colors">
              Acquisition Vault
            </Link>
            <span className="text-[#2e2e35]">/</span>
            <span className="text-[#f4f4f5]">Archival Ledger (Cart)</span>
          </nav>

          <Link
            to="/#vault"
            className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] hover:text-[#d4af37] uppercase flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Continue Curating</span>
          </Link>
        </div>

        {/* Page Title & Vault Context */}
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] uppercase font-mono">
              Certified Acquisition Ledger
            </span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#f4f4f5] tracking-tight">
              Archival Bag ({totalItems} {totalItems === 1 ? "Piece" : "Pieces"})
            </h1>
            <span className="text-xs text-[#71717a] font-mono tracking-wider">
              LEDGER REF #{user ? user._id?.slice(-8).toUpperCase() : "GUEST-VALUATION"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#a1a1aa] font-light max-w-2xl leading-relaxed">
            Review your allocated silhouettes, selected variant editions, and certified valuations prior to white-glove climate transit.
          </p>
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="mb-6 p-4 bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="py-24 px-6 text-center border border-[#1f1f28] bg-[#0c0c11] max-w-2xl mx-auto space-y-6 shadow-2xl">
            <div className="w-20 h-20 border border-[#282834] bg-[#121218] flex items-center justify-center mx-auto text-[#d4af37]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-[0.25em] block">
                Vault Status: Unallocated
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#f4f4f5]">
                Your Archival Ledger is Empty
              </h2>
              <p className="text-xs text-[#71717a] max-w-md mx-auto leading-relaxed font-light">
                No bespoke garments or registered silhouettes are currently allocated in your private bag. Explore our archival vault to discover curated releases.
              </p>
            </div>
            <Link
              to="/#vault"
              className="inline-block py-4 px-8 bg-[#d4af37] hover:bg-[#f2ca50] text-[#09090b] text-[11px] font-bold tracking-[0.25em] uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)]"
            >
              Explore Archival Vault
            </Link>
          </div>
        ) : (
          /* Ledger Grid: Items Table (Col 8) + Summary Panel (Col 4) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left 8 Cols: Detailed Garment Ledger Cards */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border border-[#1f1f28] bg-[#0d0d12] divide-y divide-[#1c1c24]">
                {items.map((item) => {
                  const prod = item.product || {};

                  // Resolve variant details
                  const variantInfo = prod.variants && Array.isArray(prod.variants) && item.variant
                    ? prod.variants.find((v) => v._id?.toString() === item.variant?.toString())
                    : null;

                  const imageUrl =
                    variantInfo?.images?.[0]?.url ||
                    prod.images?.[0]?.url ||
                    (typeof prod.images?.[0] === "string" ? prod.images[0] : null);

                  const itemPrice = item.price?.amount || 0;
                  const currency = item.price?.currency || "INR";
                  const itemSubtotal = itemPrice * item.quantity;

                  // Extract color / size attributes
                  const attributesObj = variantInfo?.attributes instanceof Map
                    ? Object.fromEntries(variantInfo.attributes)
                    : variantInfo?.attributes || {};

                  const atelierName = prod.seller?.fullname || "Independent Atelier";

                  return (
                    <div key={item._id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 group hover:bg-[#111117] transition-colors">
                      {/* High-Contrast Centered Studio Thumbnail */}
                      <Link
                        to={`/products/${prod._id}`}
                        className="w-28 h-36 sm:w-32 sm:h-40 bg-[radial-gradient(ellipse_at_center,_#1c1c26_0%,_#0f0f14_60%,_#07070a_100%)] border border-[#272734] shrink-0 overflow-hidden relative group/thumb block p-2"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={prod.title || "Archival piece"}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover/thumb:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-[#71717a] uppercase font-mono">
                            No Frame
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/80 px-1 text-[#a1a1aa]">
                          #{prod._id ? prod._id.slice(-4).toUpperCase() : "PIECE"}
                        </span>
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
                        <div>
                          {/* Atelier Name & Remove Action */}
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase font-mono">
                              {atelierName}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(item._id)}
                              className="text-[#71717a] hover:text-[#ffb4ab] text-xs transition-colors flex items-center gap-1 cursor-pointer font-mono"
                              title="Remove Piece from Archive"
                            >
                              <span>Remove</span>
                              <span>✕</span>
                            </button>
                          </div>

                          {/* Piece Title */}
                          <Link
                            to={`/products/${prod._id}`}
                            className="font-serif-luxury text-lg sm:text-xl text-[#f4f4f5] hover:text-[#d4af37] transition-colors block mt-1 line-clamp-1"
                          >
                            {prod.title || "Archival Creation"}
                          </Link>

                          {/* Edition & Attributes Specification Chips */}
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            {Object.entries(attributesObj).length > 0 ? (
                              Object.entries(attributesObj).map(([key, val], idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2.5 py-1 bg-[#14141c] border border-[#242432] text-[#f2ca50] tracking-wider uppercase font-mono flex items-center gap-1.5"
                                >
                                  <span className="text-[#71717a] font-light">{key}:</span>
                                  <span className="font-semibold">{val}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] px-2.5 py-1 bg-[#14141c] border border-[#242432] text-[#a1a1aa] tracking-wider uppercase font-mono">
                                Signature Edition
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-1 bg-[#0f0f15] border border-[#1f1f28] text-[#71717a] tracking-wider uppercase font-mono">
                              Vault Allocation
                            </span>
                          </div>
                        </div>

                        {/* Pricing & Quantity Row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#1a1a24]">
                          {/* Unit Pricing */}
                          <div className="text-xs font-mono">
                            <span className="text-[#71717a] text-[10px] block uppercase tracking-wider">Unit Valuation</span>
                            <span className="text-[#a1a1aa]">{currency} {itemPrice.toLocaleString()}</span>
                          </div>

                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[#71717a] uppercase font-mono tracking-wider">Allocation</span>
                            <div className="flex items-center border border-[#272734] bg-[#09090c]">
                              <button
                                type="button"
                                disabled={loading || item.quantity <= 1}
                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-sm text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#181822] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Decrease allocation"
                              >
                                –
                              </button>
                              <span className="w-10 text-center text-xs font-mono font-medium text-[#f4f4f5]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-sm text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#181822] transition-colors cursor-pointer disabled:opacity-30"
                                title="Increase allocation"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Subtotal Valuation */}
                          <div className="text-right">
                            <span className="text-[10px] text-[#71717a] uppercase font-mono tracking-wider block">Line Total</span>
                            <span className="font-serif-luxury text-base sm:text-lg font-medium text-[#f2ca50] tracking-wide">
                              {currency} {itemSubtotal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <Link
                  to="/#vault"
                  className="py-3 px-6 border border-[#272732] hover:border-[#d4af37] text-[#a1a1aa] hover:text-[#f4f4f5] text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors"
                >
                  ← Continue Curating Archival Pieces
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you wish to clear all pieces from your archival bag?")) {
                      handleClearCart();
                    }
                  }}
                  className="text-[#71717a] hover:text-[#ffb4ab] text-[10px] font-mono tracking-[0.18em] uppercase transition-colors cursor-pointer py-2"
                >
                  Clear Archive Bag
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Archival Valuation & Appraisal Dossier (Sticky) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="border border-[#20202a] bg-[#0c0c11] p-6 sm:p-7 space-y-5 shadow-2xl">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#d4af37] uppercase font-mono block">
                    Acquisition Dossier
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#f4f4f5] mt-1">
                    Appraisal Summary
                  </h3>
                </div>

                {/* Breakdown Ledger Table */}
                <div className="space-y-3 text-xs border-y border-[#1c1c26] py-4">
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span className="font-light">Pieces Valuation ({totalItems} items)</span>
                    <span className="font-mono text-[#f4f4f5]">INR {totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-[#a1a1aa]">
                    <span className="font-light">White-Glove Atelier Transit</span>
                    <span className="text-[#d4af37] font-mono text-[11px] uppercase tracking-wider">
                      Complimentary Bond
                    </span>
                  </div>

                  <div className="flex justify-between text-[#a1a1aa]">
                    <span className="font-light">Cryptographic Provenance</span>
                    <span className="font-mono text-[#a1a1aa]">Certified Protocol</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-[#d4af37] pt-1">
                      <span className="font-light">Salon Privilege Courtesy (10%)</span>
                      <span className="font-mono">- INR {promoDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#71717a] text-[11px] pt-1 border-t border-[#171720]">
                    <span className="font-light">Estimated Transit Time</span>
                    <span className="font-mono text-[#a1a1aa]">2–4 Business Days</span>
                  </div>
                </div>

                {/* Promo / Salon Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] uppercase block font-mono">
                    Archival Courtesy or Salon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. VEYRO10"
                      disabled={promoApplied}
                      className="bg-[#07070a] border border-[#262632] text-xs text-[#f4f4f5] px-3 py-2.5 font-mono uppercase focus:outline-none focus:border-[#d4af37] flex-1 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={promoApplied || !promoCode}
                      className="px-4 py-2.5 bg-[#171720] hover:bg-[#222230] border border-[#2e2e3e] text-[#d4af37] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {promoApplied ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                </form>

                {/* Total Valuation Row */}
                <div className="pt-2 border-t border-[#1c1c26] space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#d4af37] uppercase font-mono">
                      Total Valuation
                    </span>
                    <span className="font-serif-luxury text-3xl text-[#f2ca50] tracking-wide font-medium">
                      INR {finalValuation.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#71717a] block">
                    Inclusive of insured courier, atelier bonds & all luxury taxes.
                  </span>
                </div>

                {/* Checkout Primary Action Button */}
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full py-4 bg-[#d4af37] hover:bg-[#f2ca50] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Proceed to Secure Allocation</span>
                  <span className="transition-transform group-hover:translate-x-1 font-serif">→</span>
                </button>

                {/* Archival Service Promises */}
                <div className="pt-3 border-t border-[#1c1c24] space-y-2 text-[10px]">
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <span className="text-[#d4af37]">✓</span>
                    <span>100% Guaranteed Authentic Archival Provenance</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <span className="text-[#d4af37]">✓</span>
                    <span>Climate-Controlled Insured White-Glove Transit</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <span className="text-[#d4af37]">✓</span>
                    <span>Escrow Settlement Protocol with Direct Atelier Release</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* FINAL CHECKOUT ALLOCATION MODAL */}
      {checkoutModalOpen && items.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060608]/90 backdrop-blur-md">
          <div className="bg-[#0f0f14] border border-[#d4af37]/50 w-full max-w-xl p-6 sm:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.85)] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0c0c10] [&::-webkit-scrollbar-thumb]:bg-[#2c2c36]">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-[#71717a] hover:text-[#f4f4f5] p-2 cursor-pointer text-sm"
              title="Close"
            >
              ✕
            </button>

            <span className="text-[10px] font-bold tracking-[0.25em] text-[#d4af37] uppercase block mb-1">
              Final Acquisition Dispatch
            </span>
            <h3 className="font-serif-luxury text-2xl text-[#f4f4f5] mb-2">
              Confirm Atelier Dispatch
            </h3>
            <p className="text-xs text-[#a1a1aa] font-light mb-5">
              Please enter your private courier dispatch destination to allocate all {totalItems} items.
            </p>

            {checkoutSuccess ? (
              <div className="p-8 bg-[#09090d] border border-[#d4af37] text-center space-y-3">
                <div className="w-12 h-12 rounded-full border border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="font-serif-luxury text-xl text-[#f2ca50]">Acquisition Confirmed & Dispatched</h4>
                <p className="text-xs text-[#d4d4d8] font-light max-w-md mx-auto leading-relaxed">
                  Your archival allocation comprising {totalItems} pieces has been finalized. A cryptographically certified provenance document has been issued to your contact.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">
                    Valuation Settled: INR {finalValuation.toLocaleString()} · Tracking Protocol Generated
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-[0.2em] text-[#a1a1aa] uppercase">
                      Client Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.fullname || ""}
                      placeholder="e.g. Julian Vance"
                      required
                      className="w-full bg-[#0a0a0d] border border-[#262630] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-[0.2em] text-[#a1a1aa] uppercase">
                      Contact Phone / Email
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.email || user?.contact || ""}
                      placeholder="Direct contact details"
                      required
                      className="w-full bg-[#0a0a0d] border border-[#262630] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Delivery Address & Destination City
                  </label>
                  <input
                    type="text"
                    placeholder="Private residence address, suite, city, postal code"
                    required
                    className="w-full bg-[#0a0a0d] border border-[#262630] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Settlement Method
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="p-3 bg-[#0a0a0d] border border-[#d4af37] flex items-center gap-2 cursor-pointer text-[#f4f4f5]">
                      <input type="radio" name="paymentMethod" defaultChecked className="accent-[#d4af37]" />
                      <span>White-Glove Delivery COD</span>
                    </label>
                    <label className="p-3 bg-[#0a0a0d] border border-[#262630] hover:border-[#71717a] flex items-center gap-2 cursor-pointer text-[#a1a1aa]">
                      <input type="radio" name="paymentMethod" className="accent-[#d4af37]" />
                      <span>Vault Wire / Escrow</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-[#07070a] border border-[#1e1e28] flex justify-between items-center text-xs">
                  <span className="text-[#a1a1aa]">Total Payable Valuation:</span>
                  <span className="font-serif-luxury text-base text-[#f2ca50] font-semibold">
                    INR {finalValuation.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#d4af37] hover:bg-[#f2ca50] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)] cursor-pointer mt-2"
                >
                  Confirm Archival Allocation & Dispatch
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <AuthFooter />
    </div>
  );
}
