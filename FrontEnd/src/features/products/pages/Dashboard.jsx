import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { useAuth } from "../../auth/hook/useAuth";
import AuthHeader from "../../auth/components/AuthHeader";
import AuthFooter from "../../auth/components/AuthFooter";

// Helper to safely extract image URLs whether stored as string or object { url }
const extractImageUrls = (product) => {
  if (!product?.images || !Array.isArray(product.images)) return [];
  return product.images
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);
};

/* Product Card */
function ProductCard({ product, onOpenGallery }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = useMemo(() => extractImageUrls(product), [product]);
  const hasMultipleImages = images.length > 1;

  const currentImage = images[activeImageIndex] || images[0];

  const formattedDate = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Archive";

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <article className="bg-[#121216] border border-[#232329] hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col justify-between group champagne-glow relative overflow-hidden">
      {/* Subtle Top Gold Hairline on Hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />

      <div>
        {/* Main Image Showcase Frame */}
        <div
          onClick={() => onOpenGallery(product, activeImageIndex)}
          className="relative aspect-[4/5] bg-[#0c0c0f] overflow-hidden border-b border-[#1e1e24] cursor-pointer"
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${product.title} - Frame ${activeImageIndex + 1}`}
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#52525b] p-6 text-center">
              <svg className="w-10 h-10 mb-2 text-[#3f3f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] tracking-widest uppercase">Archival Piece</span>
            </div>
          )}

          {/* Overlaid Badges */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#09090b]/85 backdrop-blur-sm border border-[#27272a] text-[9px] font-semibold tracking-widest text-[#f2ca50] uppercase">
              {images.length > 0
                ? `Frame ${String(activeImageIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`
                : "1 Frame"}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {/* Click to open full gallery zoom */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenGallery(product, activeImageIndex);
              }}
              title="Inspect All Frames"
              className="p-1.5 bg-[#09090b]/85 backdrop-blur-sm border border-[#27272a] hover:border-[#d4af37] text-[#e5e1e4] hover:text-[#f2ca50] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>
          </div>

          {/* Carousel Left / Right Arrows (visible when multiple images exist) */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Frame"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#09090b]/80 hover:bg-[#121216] border border-[#27272a] hover:border-[#d4af37] text-[#f4f4f5] hover:text-[#f2ca50] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Frame"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#09090b]/80 hover:bg-[#121216] border border-[#27272a] hover:border-[#d4af37] text-[#f4f4f5] hover:text-[#f2ca50] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Bottom Dash Indicators for Carousel */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center items-center gap-1.5 px-4 pointer-events-none">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-0.5 transition-all duration-300 ${
                    idx === activeImageIndex
                      ? "w-5 bg-[#d4af37]"
                      : "w-2 bg-[#f4f4f5]/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mini Thumbnails Row */}
        {hasMultipleImages && (
          <div className="px-5 pt-3 pb-1 bg-[#0e0e12] border-b border-[#1e1e24] flex items-center gap-2 overflow-x-auto">
            {images.map((imgUrl, idx) => {
              const isActive = idx === activeImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  title={`View Frame 0${idx + 1}`}
                  className={`relative shrink-0 w-10 h-10 border transition-all duration-200 overflow-hidden ${
                    isActive
                      ? "border-[#d4af37] ring-1 ring-[#d4af37]/50 opacity-100 scale-105"
                      : "border-[#27272a] opacity-50 hover:opacity-100 hover:border-[#a1a1aa]"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 text-[7px] font-semibold bg-[#09090b]/90 text-[#f2ca50] px-0.5 leading-none">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onOpenGallery(product, activeImageIndex)}
              className="shrink-0 text-[9px] tracking-wider text-[#d4af37] hover:text-[#f2ca50] underline uppercase ml-auto whitespace-nowrap pl-2"
            >
              All ({images.length})
            </button>
          </div>
        )}

        {/* Content Section */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-[10px] tracking-wider text-[#71717a] uppercase">
            <span>{formattedDate}</span>
            <span className="text-[#d4af37]">Verified Provenance</span>
          </div>

          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#f4f4f5] tracking-wide group-hover:text-[#f2ca50] transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-[#a1a1aa] font-light leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Valuation & Bottom Actions */}
      <div className="p-5 sm:p-6 pt-3 border-t border-[#1e1e24] flex items-center justify-between">
        <div>
          <span className="text-[9px] font-semibold tracking-[0.2em] text-[#71717a] uppercase block">
            Acquisition Value
          </span>
          <span className="font-serif-luxury text-lg sm:text-xl text-[#f2ca50] tracking-wide font-medium">
            {Number(product.price?.amount || 0).toLocaleString("en-US", {
              maximumFractionDigits: 2
            })}{" "}
            <span className="text-xs font-sans-luxury text-[#e5e1e4]">
              {product.price?.currency || "USD"}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenGallery(product, activeImageIndex)}
          className="px-3.5 py-2 border border-[#27272a] hover:border-[#d4af37] text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] hover:text-[#f4f4f5] transition-all uppercase cursor-pointer"
        >
          View All Frames ({images.length})
        </button>
      </div>
    </article>
  );
}

/* Atelier Gallery Modal */
function AtelierGalleryModal({ product, initialIndex = 0, onClose }) {
  const [modalIndex, setModalIndex] = useState(initialIndex);
  const images = useMemo(() => extractImageUrls(product), [product]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setModalIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    },
    [images.length, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown]);

  if (!product || images.length === 0) return null;

  const currentImg = images[modalIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#08080a]/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto"
    >
      {/* Top Bar */}
      <header className="w-full px-6 sm:px-10 py-5 border-b border-[#202026] flex items-center justify-between shrink-0 bg-[#08080a]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="font-serif-luxury text-xl sm:text-2xl text-[#f4f4f5] tracking-wide">
            {product.title}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-semibold tracking-[0.25em] text-[#d4af37] border-l border-[#27272a] pl-4 uppercase">
            Frame {String(modalIndex + 1).padStart(2, "0")} of {String(images.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-serif-luxury text-[#f2ca50] tracking-wide hidden md:inline-block">
            {Number(product.price?.amount || 0).toLocaleString("en-US", {
              maximumFractionDigits: 2
            })}{" "}
            {product.price?.currency || "USD"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Archival Inspector"
            className="p-2 border border-[#27272a] hover:border-[#d4af37] text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* High-Resolution Frame */}
      <div className="grow relative flex items-center justify-center p-4 sm:p-8 my-auto">
        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            aria-label="Previous Frame"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-[#121216]/90 hover:bg-[#1a1a20] border border-[#27272a] hover:border-[#d4af37] text-[#f4f4f5] hover:text-[#f2ca50] flex items-center justify-center transition-all cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Main Image Frame Container */}
        <div className="relative max-h-[62vh] sm:max-h-[70vh] max-w-4xl w-full flex items-center justify-center">
          <img
            src={currentImg}
            alt={`${product.title} - Frame ${modalIndex + 1}`}
            className="max-h-[62vh] sm:max-h-[70vh] w-auto max-w-full object-contain border border-[#232329] champagne-glow"
          />
        </div>

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => setModalIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            aria-label="Next Frame"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-[#121216]/90 hover:bg-[#1a1a20] border border-[#27272a] hover:border-[#d4af37] text-[#f4f4f5] hover:text-[#f2ca50] flex items-center justify-center transition-all cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnails Strip & Metadata */}
      <footer className="w-full px-6 sm:px-10 py-5 border-t border-[#202026] bg-[#0c0c0f] shrink-0 space-y-4">
        {/* Thumbnails Row */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto py-1">
          {images.map((imgUrl, idx) => {
            const isActive = idx === modalIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setModalIndex(idx)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 border transition-all duration-200 overflow-hidden cursor-pointer ${
                  isActive
                    ? "border-[#d4af37] ring-2 ring-[#d4af37]/60 scale-105"
                    : "border-[#27272a] opacity-60 hover:opacity-100 hover:border-[#a1a1aa]"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 text-[8px] font-semibold bg-[#09090b]/80 text-[#f2ca50] px-1 leading-none">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Description Excerpt & Provenance */}
        <div className="max-w-2xl mx-auto text-center space-y-1">
          <p className="text-xs text-[#a1a1aa] font-light leading-relaxed line-clamp-2">
            {product.description}
          </p>
          <span className="text-[10px] tracking-[0.25em] text-[#71717a] uppercase block">
            Archival Cryptography Verified · Frame {modalIndex + 1} of {images.length}
          </span>
        </div>
      </footer>
    </div>
  );
}

/* Main Dashboard Component */
export default function Dashboard() {
  const { user } = useAuth();
  const { handlegetSellerProducts, loading, error } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProduct) || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  // State for the full archival inspection modal
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(sellerProducts) ? [...sellerProducts] : [];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Filter by currency
    if (selectedCurrency !== "ALL") {
      list = list.filter((p) => p.price?.currency === selectedCurrency);
    }

    // Sort
    if (sortBy === "price-high") {
      list.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    } else if (sortBy === "price-low") {
      list.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else {
      // Newest first
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [sellerProducts, searchQuery, selectedCurrency, sortBy]);

  // Aggregate metrics
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
      {/* Top Navbar */}
      <AuthHeader actionLabel="+ Create Product" actionTo="/products/create" />

      {/* Main Dashboard Workspace */}
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
          {/* Card 1: Total Creations */}
          <div className="bg-[#121216] border border-[#232329] p-5 sm:p-6 champagne-glow relative">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block mb-2">
              01. LISTED CREATIONS
            </span>
            <div className="font-serif-luxury text-2xl sm:text-3xl text-[#f4f4f5] tracking-wide mb-1">
              {sellerProducts.length} <span className="text-sm font-light text-[#a1a1aa] font-sans-luxury">Pieces</span>
            </div>
            <p className="text-[11px] text-[#71717a] font-light">
              Active archival catalog entries
            </p>
          </div>

          {/* Card 2: Portfolio Valuation */}
          <div className="bg-[#121216] border border-[#232329] p-5 sm:p-6 champagne-glow relative">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block mb-2">
              02. PORTFOLIO VALUE
            </span>
            <div className="font-serif-luxury text-2xl sm:text-3xl text-[#f2ca50] tracking-wide mb-1">
              {totalValuation.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-[#71717a] font-light">
              Combined catalog appraisal
            </p>
          </div>

          {/* Card 3: Archival Frames */}
          <div className="bg-[#121216] border border-[#232329] p-5 sm:p-6 champagne-glow relative">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block mb-2">
              03. ARCHIVAL FRAMES
            </span>
            <div className="font-serif-luxury text-2xl sm:text-3xl text-[#f4f4f5] tracking-wide mb-1">
              {totalFrames} <span className="text-sm font-light text-[#a1a1aa] font-sans-luxury">Imagery Frames</span>
            </div>
            <p className="text-[11px] text-[#71717a] font-light">
              Uploaded high-resolution media
            </p>
          </div>

          {/* Card 4: Accreditation */}
          <div className="bg-[#121216] border border-[#232329] p-5 sm:p-6 champagne-glow relative">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block mb-2">
              04. ACCREDITATION
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="font-serif-luxury text-xl sm:text-2xl text-[#f4f4f5] tracking-wide">
                Verified Atelier
              </span>
            </div>
            <p className="text-[11px] text-[#71717a] font-light">
              Digital Authenticity Ledger Active
            </p>
          </div>
        </section>

        {/* Search, Filter & Sort Controls */}
        <section className="bg-[#121216] border border-[#232329] p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Field */}
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

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Currency Filter */}
            <div className="relative">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-[#0c0c0f] border border-[#27272a] text-xs text-[#a1a1aa] py-2.5 pl-3 pr-8 focus:border-[#d4af37] focus:outline-none appearance-none cursor-pointer tracking-wider uppercase font-medium"
              >
                <option value="ALL">All Currencies</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="INR">INR (₹)</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none text-[10px]">
                ▼
              </span>
            </div>

            {/* Sort Selector */}
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
              <ProductCard
                key={product._id}
                product={product}
                onOpenGallery={openGallery}
              />
            ))}

            {/* Quick Creation Callout Card */}
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

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
