import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../../products/hook/useProduct";
import { useAuth } from "../../auth/hook/useAuth";
import AuthHeader from "../../auth/components/AuthHeader";
import AuthFooter from "../../auth/components/AuthFooter";
import SellerProductCard from "../components/SellerProductCard";
import AtelierGalleryModal from "../components/AtelierGalleryModal";

export default function Dashboard() {
  const { user } = useAuth();
  const { handlegetSellerProducts, loading, error } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProduct) || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const [galleryModalState, setGalleryModalState] = useState({
    isOpen: false,
    product: null,
    initialIndex: 0
  });

  const openGallery = (product, initialIndex = 0) => {
    setGalleryModalState({
      isOpen: true,
      product,
      initialIndex
    });
  };

  const closeGallery = () => {
    setGalleryModalState({
      isOpen: false,
      product: null,
      initialIndex: 0
    });
  };

  useEffect(() => {
    handlegetSellerProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = Array.isArray(sellerProducts) ? [...sellerProducts] : [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedCurrency !== "ALL") {
      list = list.filter((p) => p.price?.currency === selectedCurrency);
    }

    if (sortBy === "price-high") {
      list.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    } else if (sortBy === "price-low") {
      list.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [sellerProducts, searchQuery, selectedCurrency, sortBy]);

  const totalValuation = useMemo(() => {
    if (!Array.isArray(sellerProducts)) return 0;
    return sellerProducts.reduce((sum, p) => sum + (Number(p.price?.amount) || 0), 0);
  }, [sellerProducts]);

  const totalFrames = useMemo(() => {
    if (!Array.isArray(sellerProducts)) return 0;
    return sellerProducts.reduce((sum, p) => sum + (p.images?.length || 0), 0);
  }, [sellerProducts]);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury selection:bg-[#d4af37] selection:text-[#09090b]">
      <AuthHeader actionLabel="+ Create Product" actionTo="/products/create" />

      <main className="grow max-w-360 w-full mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        {/* Breadcrumb & Top Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <nav className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-[#71717a] uppercase">
            <Link to="/" className="hover:text-[#d4af37] transition-colors">Atelier</Link>
            <span className="text-[#2e2e35]">/</span>
            <span className="text-[#a1a1aa]">Partner Dashboard</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121216] border border-[#d4af37]/40 text-[9px] font-semibold tracking-[0.25em] text-[#f2ca50] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span>Authenticated Partner House · {user?.fullname || "Atelier"}</span>
          </div>
        </div>

        {/* Headline Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#202026] mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-px bg-[#d4af37]" />
              <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                Partner Atelier Portfolio
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#f4f4f5] tracking-wide mb-3">
              Curated Atelier Creations
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed max-w-2xl">
              Review, monitor, and inspect your documented haute couture silhouettes and complete archival photography frames.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/products/create"
              className="inline-flex items-center gap-2 py-3.5 px-6 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#f2ca50] hover:shadow-[0_0_25px_rgba(242,202,80,0.3)] transition-all duration-300 group cursor-pointer"
            >
              <span>+ LIST NEW CREATION</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Metrics Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#121216] border border-[#232329] p-5 sm:p-6 champagne-glow relative">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block mb-2">
              01. LISTED CREATIONS
            </span>
            <div className="font-serif-luxury text-2xl sm:text-3xl text-[#f4f4f5] tracking-wide mb-1">
              {sellerProducts.length} <span className="text-sm font-light text-[#a1a1aa] font-sans-luxury">Pieces</span>
            </div>
            <p className="text-[11px] text-[#71717a] font-light">
              Active in confidential client salon
            </p>
          </div>

          <div className="bg-[#121216] border border-[#232329] p-5 sm:p-6 champagne-glow relative">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block mb-2">
              02. PORTFOLIO VALUATION
            </span>
            <div className="font-serif-luxury text-2xl sm:text-3xl text-[#f2ca50] tracking-wide mb-1">
              ₹ {totalValuation.toLocaleString("en-IN", { maximumFractionDigits: 0 })}{" "}
              <span className="text-sm font-light text-[#a1a1aa] font-sans-luxury">
                {selectedCurrency === "ALL" ? "INR" : selectedCurrency}
              </span>
            </div>
            <p className="text-[11px] text-[#71717a] font-light">
              Combined appraisal across creations
            </p>
          </div>

          <div className="bg-[#121216] border border-[#232329] p-5 sm:p-6 champagne-glow relative">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block mb-2">
              03. PHOTOGRAPHIC ARCHIVES
            </span>
            <div className="font-serif-luxury text-2xl sm:text-3xl text-[#f4f4f5] tracking-wide mb-1">
              {totalFrames} <span className="text-sm font-light text-[#a1a1aa] font-sans-luxury">Frames</span>
            </div>
            <p className="text-[11px] text-[#71717a] font-light">
              High-res editorial exposures uploaded
            </p>
          </div>

          <div className="bg-[#121216] border border-[#232329] p-5 sm:p-6 champagne-glow relative">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block mb-2">
              04. ATELIER STATUS
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="font-serif-luxury text-xl sm:text-2xl text-[#f4f4f5] tracking-wide">
                Verified House
              </span>
            </div>
            <p className="text-[11px] text-[#71717a] font-light">
              Digital Authenticity Ledger Active
            </p>
          </div>
        </section>

        {/* Search, Filter & Sort Controls */}
        <section className="bg-[#121216] border border-[#232329] p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative grow max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archival title or description..."
              className="w-full bg-[#0c0c0f] border border-[#27272a] text-sm text-[#f4f4f5] placeholder:text-[#52525b] pl-10 pr-4 py-2.5 focus:border-[#d4af37] focus:ring-0 focus:outline-none tracking-wide font-light transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-[#0c0c0f] border border-[#27272a] text-xs text-[#a1a1aa] py-2.5 pl-3 pr-8 focus:border-[#d4af37] focus:outline-none appearance-none cursor-pointer tracking-wider uppercase font-medium"
              >
                <option value="ALL">All Currencies</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none text-[10px]">
                ▼
              </span>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0c0c0f] border border-[#27272a] text-xs text-[#a1a1aa] py-2.5 pl-3 pr-8 focus:border-[#d4af37] focus:outline-none appearance-none cursor-pointer tracking-wider uppercase font-medium"
              >
                <option value="newest">Sort: Newest Listed</option>
                <option value="price-high">Sort: Price (High to Low)</option>
                <option value="price-low">Sort: Price (Low to High)</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none text-[10px]">
                ▼
              </span>
            </div>
          </div>
        </section>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 bg-[#1c0f10] border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              onClick={() => handlegetSellerProducts()}
              className="underline text-[#f2ca50] hover:text-[#f4f4f5] cursor-pointer tracking-wider uppercase font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && sellerProducts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#121216] border border-[#232329] p-5 h-96 flex flex-col justify-between">
                <div className="bg-[#1c1b1f] w-full h-48 mb-4" />
                <div className="h-4 bg-[#27272a] w-3/4 mb-2" />
                <div className="h-3 bg-[#27272a] w-full mb-4" />
                <div className="h-6 bg-[#27272a] w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-[#121216] border border-[#232329] p-12 sm:p-16 text-center max-w-2xl mx-auto champagne-glow">
            <div className="w-14 h-14 mx-auto mb-6 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase block mb-2">
              Atelier Vault Empty
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#f4f4f5] tracking-wide mb-3">
              {searchQuery ? "No Matching Creations Found" : "No Archival Creations Listed Yet"}
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed mb-8 max-w-md mx-auto">
              {searchQuery
                ? `No pieces in your catalog matched "${searchQuery}". Clear your search query or reset filters.`
                : "Document your first bespoke couture silhouette or limited runway release to make it accessible to your private international clientele."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCurrency("ALL");
                }}
                className="py-3 px-6 border border-[#27272a] text-[#a1a1aa] text-[11px] font-semibold tracking-[0.2em] uppercase hover:border-[#d4af37] hover:text-[#f4f4f5] transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/products/create"
                className="py-3.5 px-8 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#f2ca50] hover:shadow-[0_0_25px_rgba(242,202,80,0.3)] transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>+ LIST YOUR FIRST CREATION</span>
              </Link>
            )}
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <SellerProductCard
                key={product._id}
                product={product}
                onOpenGallery={openGallery}
              />
            ))}

            <article className="border-2 border-dashed border-[#27272a] hover:border-[#d4af37]/50 bg-[#0c0c0f]/60 hover:bg-[#121216] transition-all duration-300 p-8 flex flex-col items-center justify-center text-center group min-h-100">
              <div className="w-12 h-12 mb-4 border border-[#27272a] group-hover:border-[#d4af37] flex items-center justify-center text-[#71717a] group-hover:text-[#d4af37] transition-colors">
                <span className="text-2xl leading-none font-light">+</span>
              </div>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#d4af37] uppercase block mb-1.5">
                New Catalog Entry
              </span>
              <h4 className="font-serif-luxury text-xl text-[#f4f4f5] tracking-wide mb-2">
                Document a New Creation
              </h4>
              <p className="text-xs text-[#71717a] font-light max-w-xs mb-6 leading-relaxed">
                List another bespoke silhouette, runway cap, or couture gown into your verified archive.
              </p>
              <Link
                to="/products/create"
                className="py-3 px-6 bg-transparent border border-[#d4af37]/60 hover:border-[#d4af37] text-[#f2ca50] hover:text-[#f4f4f5] text-[10px] font-semibold tracking-[0.25em] uppercase transition-all"
              >
                Begin Registration →
              </Link>
            </article>
          </div>
        )}
      </main>

      {/* Gallery Modal */}
      {galleryModalState.isOpen && galleryModalState.product && (
        <AtelierGalleryModal
          product={galleryModalState.product}
          initialIndex={galleryModalState.initialIndex}
          onClose={closeGallery}
        />
      )}

      <AuthFooter />
    </div>
  );
}

