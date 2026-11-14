import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth";
import { useProduct } from "../../products/hook/useProduct";
import AuthHeader from "../../auth/components/AuthHeader";
import AuthFooter from "../../auth/components/AuthFooter";
import BuyerProductCard from "../components/BuyerProductCard";

export default function BuyerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSeller = Boolean(user && (user.role === "seller" || user.isSeller === true));

  useEffect(() => {
    if (isSeller) {
      navigate("/dashboard", { replace: true });
    }
  }, [isSeller, navigate]);

  const { handleGetAllProducts, loading } = useProduct();
  const catalogProducts = useSelector((state) => state.product.catalogProducts);

  const [searchQuery, setSearchQuery] = useState("");
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [salonCity, setSalonCity] = useState("Paris, Place Vendôme");
  const [salonBooked, setSalonBooked] = useState(false);

  useEffect(() => {
    handleGetAllProducts().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      }
    }
  }, []);

  const products = useMemo(() => {
    return Array.isArray(catalogProducts) ? catalogProducts : [];
  }, [catalogProducts]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((item) =>
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleAcquisitionSubmit = (e) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryProduct(null);
    }, 2800);
  };

  const handleSalonBooking = (e) => {
    e.preventDefault();
    setSalonBooked(true);
    setTimeout(() => setSalonBooked(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury selection:bg-[#d4af37] selection:text-[#09090b]">
      <AuthHeader />

      <section className="relative overflow-hidden border-b border-[#202026] min-h-[82vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="Veyro Haute Couture Private Salon"
            className="w-full h-full object-cover object-center opacity-30 filter brightness-[0.7] contrast-[1.15] transition-transform duration-1000 ease-out hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-[#08080a]/50" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-140 rounded-full bg-[#d4af37]/8 blur-[160px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center space-y-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#121216]/90 border border-[#d4af37]/30 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
              {user ? `PRIVATE CLIENT PORTAL • WELCOME ${user.fullname?.split(" ")[0]?.toUpperCase() || "PATRON"}` : "PRIVATE CLIENT SALON • FALL / WINTER COLLECTIVE"}
            </span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl text-[#f4f4f5] tracking-tight leading-[1.08]">
            Curated Archival <br />
            <span className="italic font-light text-[#f2ca50]">Haute Couture.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#a1a1aa] font-light max-w-2xl mx-auto leading-relaxed">
            Welcome to VEYRO’s confidential salon. Explore verified archival pieces, private runway drops, and bespoke hand-tailored masterpieces directly from partner ateliers.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a
              href="#vault"
              className="py-4 px-8 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[#f2ca50] hover:shadow-[0_0_30px_rgba(242,202,80,0.3)] cursor-pointer"
            >
              Explore Archival Vault
            </a>
            <a
              href="#salon"
              className="py-4 px-8 border border-[#d4af37]/60 text-[#f2ca50] text-[11px] font-bold tracking-[0.28em] uppercase hover:bg-[#d4af37] hover:text-[#09090b] transition-all duration-300 cursor-pointer"
            >
              Reserve Private Salon
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[#202026] bg-[#0c0c10]">
        <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-16 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 border border-[#202026] bg-[#121216]/60 flex items-start gap-3.5">
              <span className="text-[#d4af37] font-serif-luxury text-lg">01</span>
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#f4f4f5] uppercase block mb-1">
                  Guaranteed Allocation
                </span>
                <p className="text-[11px] text-[#71717a] font-light leading-snug">
                  Priority reservation privileges for seasonal runway caps and private atelier releases.
                </p>
              </div>
            </div>

            <div className="p-4 border border-[#202026] bg-[#121216]/60 flex items-start gap-3.5">
              <span className="text-[#d4af37] font-serif-luxury text-lg">02</span>
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#f4f4f5] uppercase block mb-1">
                  Private Salon Fittings
                </span>
                <p className="text-[11px] text-[#71717a] font-light leading-snug">
                  Personal bespoke appointments in Paris, Milan, London, Tokyo, and New York salons.
                </p>
              </div>
            </div>

            <div className="p-4 border border-[#202026] bg-[#121216]/60 flex items-start gap-3.5">
              <span className="text-[#d4af37] font-serif-luxury text-lg">03</span>
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#f4f4f5] uppercase block mb-1">
                  Archival Provenance
                </span>
                <p className="text-[11px] text-[#71717a] font-light leading-snug">
                  Verified certificates of authenticity and documented records for every acquisition.
                </p>
              </div>
            </div>

            <div className="p-4 border border-[#202026] bg-[#121216]/60 flex items-start gap-3.5">
              <span className="text-[#d4af37] font-serif-luxury text-lg">04</span>
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#f4f4f5] uppercase block mb-1">
                  Concierge Liaison
                </span>
                <p className="text-[11px] text-[#71717a] font-light leading-snug">
                  Dedicated personal styling directors available for custom commissions and discrete inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vault" className="scroll-mt-20 py-20 lg:py-28 max-w-360 mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#202026] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-px bg-[#d4af37]" />
              <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                THE CONFIDENTIAL COLLECTION
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f4f4f5] tracking-wide">
              Archival Catalog
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-light mt-1 max-w-md">
              Singular artisanal craftsmanship, tailored European heritage textiles, and gallery-grade finishes.
            </p>
          </div>

          <div className="w-full md:w-80 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archival pieces..."
              className="w-full bg-[#121216] border border-[#27272a] text-xs text-[#f4f4f5] placeholder:text-[#52525b] pl-10 pr-4 py-3 focus:outline-none focus:border-[#d4af37] font-light"
            />
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-[#d4af37] tracking-[0.25em] uppercase font-light">
              Loading catalog creations...
            </p>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((item) => (
              <BuyerProductCard
                key={item._id}
                product={item}
                onAcquire={() => setInquiryProduct(item)}
              />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-24 text-center border border-[#202026] bg-[#101014] p-12">
            <span className="font-serif-luxury text-2xl text-[#f4f4f5] block mb-2">No Creations Available</span>
            <p className="text-xs text-[#71717a] font-light max-w-sm mx-auto mb-6">
              {searchQuery
                ? "No archival pieces match your search terms. Try clearing or modifying your query."
                : "There are currently no pieces listed in the archive. Please check back shortly or schedule a private salon consultation."}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="py-2 px-5 border border-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5] hover:border-[#d4af37] text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>

      <section id="salon" className="scroll-mt-20 border-t border-[#202026] bg-[#0c0c10] py-20 lg:py-28">
        <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-px bg-[#d4af37]" />
              <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                BESPOKE FITTINGS & PRIVATE VIEWINGS
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#f4f4f5] leading-tight">
              Reserve Your Private Salon Appointment
            </h2>
            <p className="text-sm text-[#a1a1aa] font-light leading-relaxed">
              Experience private salon consultations reserved exclusively for verified clientele. Meet directly with atelier master tailors and personal stylists in our flagship heritage salons.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-[#e5e1e4] font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span>Confidential tasting & private viewing suites</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#e5e1e4] font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span>Made-to-measure bespoke precision tailoring</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#e5e1e4] font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span>Discreet white-glove courier to your residence or hotel</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#121216] border border-[#27272a] p-8 sm:p-10 champagne-glow relative">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <h3 className="font-serif-luxury text-xl text-[#f4f4f5] mb-2">Request Salon Reservation</h3>
              <p className="text-xs text-[#a1a1aa] font-light mb-6">
                Our concierge director will confirm your appointment within 4 hours.
              </p>

              {salonBooked ? (
                <div className="p-6 bg-[#09090b] border border-[#d4af37] text-center space-y-2">
                  <span className="text-[#d4af37] font-serif-luxury text-lg block">Reservation Received</span>
                  <p className="text-xs text-[#a1a1aa] font-light">
                    Your salon reservation for <strong>{salonCity}</strong> has been logged. Our Senior Concierge will contact you privately.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSalonBooking} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                      Select Atelier Salon Location
                    </label>
                    <select
                      value={salonCity}
                      onChange={(e) => setSalonCity(e.target.value)}
                      className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="Paris, Place Vendôme">Paris • Place Vendôme Private Salon</option>
                      <option value="Milan, Via Montenapoleone">Milan • Via Montenapoleone Atelier</option>
                      <option value="London, Mayfair">London • Mayfair Heritage Suite</option>
                      <option value="Tokyo, Ginza">Tokyo • Ginza Private Residence</option>
                      <option value="New York, Madison Avenue">New York • Madison Avenue Salon</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                        Client Contact
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.contact || user?.email || ""}
                        placeholder="Direct contact or phone"
                        required
                        className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#f2ca50] transition-colors cursor-pointer mt-2"
                  >
                    Confirm Private Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {inquiryProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/90 backdrop-blur-md">
          <div className="bg-[#121216] border border-[#d4af37]/40 w-full max-w-lg p-8 relative champagne-glow">
            <button
              type="button"
              onClick={() => setInquiryProduct(null)}
              className="absolute top-4 right-4 text-[#71717a] hover:text-[#f4f4f5] p-2"
            >
              ✕
            </button>

            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase block mb-1">
              PRIVATE ALLOCATION REQUEST
            </span>
            <h3 className="font-serif-luxury text-2xl text-[#f4f4f5] mb-2">
              {inquiryProduct.title}
            </h3>
            <p className="text-xs text-[#d4af37] font-semibold tracking-wider mb-4">
              Listed Price: {inquiryProduct.price?.currency || "INR"} {Number(inquiryProduct.price?.amount || 0).toLocaleString()}
            </p>

            {inquirySuccess ? (
              <div className="p-6 bg-[#09090b] border border-[#d4af37] text-center space-y-2">
                <span className="text-[#d4af37] font-serif-luxury text-lg block">Request Dispatched</span>
                <p className="text-xs text-[#a1a1aa] font-light">
                  Your acquisition allocation has been submitted directly to the atelier team. You will be contacted shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAcquisitionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Patron Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.fullname || ""}
                    placeholder="Enter full name"
                    required
                    className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Private Contact / Email
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.email || user?.contact || ""}
                    placeholder="Direct contact channel"
                    required
                    className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Delivery City or Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. London, Paris, New York, Mumbai"
                    required
                    className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Bespoke Notes or Inquiries
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify sizing, bespoke requirements, or special notes..."
                    className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase hover:bg-[#f2ca50] transition-colors cursor-pointer"
                >
                  Submit Acquisition Request
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
