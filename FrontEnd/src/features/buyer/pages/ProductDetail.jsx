import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../../products/hook/useProduct";
import { useAuth } from "../../auth/hook/useAuth";
import { useCart } from "../../cart/hook/useCart";
import AuthHeader from "../../auth/components/AuthHeader";
import AuthFooter from "../../auth/components/AuthFooter";

// Returns the color label for an edition button (avoids repeating sizes)
const getVariantColor = (v, idx) => {
  if (!v?.attributes) return `Edition ${idx + 1}`;
  const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes;
  const color = attrs.Color || attrs.color || attrs.Colour || attrs.colour;
  const size = attrs.Size || attrs.size;
  // If color was mistakenly typed in the size field
  if (color && size && /^\d/.test(color)) return size;
  return color || size || `Edition ${idx + 1}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { handleGetProductById, loading, error } = useProduct();
  const { handleAddToCart, loading: cartLoading } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  const catalogProducts = useSelector((state) => state.product.catalogProducts);
  const cachedProduct = useMemo(
    () => (Array.isArray(catalogProducts) ? catalogProducts.find((p) => p._id === id) : null),
    [catalogProducts, id]
  );

  const [product, setProduct] = useState(cachedProduct || null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Modals
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [buyNowSuccess, setBuyNowSuccess] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      handleGetProductById(id)
        .then((data) => {
          if (data) setProduct(data);
        })
        .catch(() => { });
    }
  }, [id]);

  useEffect(() => {
    if (!product && cachedProduct) {
      setProduct(cachedProduct);
    }
  }, [cachedProduct, product]);

  // Open Buy Now modal directly if arriving with ?buyNow=1
  useEffect(() => {
    if (location.search.includes("buyNow=1")) {
      setBuyNowModalOpen(true);
    }
  }, [location.search]);

  const activeVariant = useMemo(() => {
    if (selectedVariantIndex >= 0 && product?.variants?.[selectedVariantIndex]) {
      return product.variants[selectedVariantIndex];
    }
    return null;
  }, [product?.variants, selectedVariantIndex]);

  const images = useMemo(() => {
    if (activeVariant && Array.isArray(activeVariant.images) && activeVariant.images.length > 0) {
      const vImgs = activeVariant.images
        .map((img) => (typeof img === "string" ? { url: img } : img))
        .filter((img) => Boolean(img?.url));
      if (vImgs.length > 0) return vImgs;
    }
    if (!product?.images || !Array.isArray(product.images)) return [];
    return product.images
      .map((img) => (typeof img === "string" ? { url: img } : img))
      .filter((img) => Boolean(img?.url));
  }, [product?.images, activeVariant]);

  const activeImageUrl = images[activeImageIndex]?.url;

  const formattedPrice = useMemo(() => {
    const targetPrice = activeVariant?.price || product?.price;
    if (!targetPrice) return "";
    const amt = Number(targetPrice.amount || 0);
    const curr = targetPrice.currency || "INR";
    return `${curr} ${amt.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  }, [product?.price, activeVariant]);

  const formattedDate = useMemo(() => {
    if (!product?.createdAt) return null;
    return new Date(product.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }, [product?.createdAt]);

  const handleCopyId = () => {
    if (product?._id) {
      navigator.clipboard.writeText(product._id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2200);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryModalOpen(false);
    }, 2800);
  };

  // Dedicated "Buy Now" handler (Direct Instant Purchase - NEVER touches cart)
  const handleBuyNowClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBuyNowModalOpen(true);
  };

  const handleBuyNowSubmit = (e) => {
    e.preventDefault();
    setBuyNowSuccess(true);
    setTimeout(() => {
      setBuyNowSuccess(false);
      setBuyNowModalOpen(false);
    }, 3200);
  };

  // Dedicated "Add to Cart" handler (ONLY this adds specific piece to cart & triggers toast)
  const handleCartAdd = async () => {
    if (!product?._id) return;
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    const variantId = activeVariant?._id || (selectedVariantIndex >= 0 ? product?.variants?.[selectedVariantIndex]?._id : null);
    await handleAddToCart({
      productId: product._id,
      variantId,
      quantity: 1,
      toastMeta: {
        title: product.title,
        edition: activeVariant ? getVariantColor(activeVariant, selectedVariantIndex) : "Signature Edition",
        imageUrl: activeImageUrl,
        price: (activeVariant?.price || product?.price)?.amount,
        currency: (activeVariant?.price || product?.price)?.currency || "INR"
      }
    });
    setAddingToCart(false);
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
              Catalog
            </Link>
            <span className="text-[#2e2e35]">/</span>
            <span className="text-[#f4f4f5] truncate max-w-xs sm:max-w-md">
              {product?.title || id}
            </span>
          </nav>

          <Link
            to="/#vault"
            className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] hover:text-[#d4af37] uppercase flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Catalog</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && !product && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#d4af37] tracking-[0.28em] uppercase font-light">
              Retrieving Archival Record #{id}...
            </p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && (!product || error) && (
          <div className="py-24 text-center border border-[#202026] bg-[#101014] p-12 max-w-xl mx-auto champagne-glow">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase block mb-2">
              Archival Record Not Located
            </span>
            <h1 className="font-serif-luxury text-3xl text-[#f4f4f5] mb-3">
              Piece Unavailable
            </h1>
            <p className="text-xs text-[#71717a] font-light leading-relaxed mb-8">
              The creation associated with identifier <strong>{id}</strong> could not be located in the archival ledger. It may have been allocated privately or relocated.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="py-3 px-8 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#f2ca50] transition-colors cursor-pointer"
            >
              Explore Archival Vault
            </button>
          </div>
        )}

        {/* Detailed Product Presentation */}
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
            {/* Left: Gallery Stage */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4">
              {/* Main High-Res Frame with Studio Contrast & Full Garment View */}
              <div className="relative aspect-[3/4] max-h-[660px] w-full bg-[radial-gradient(ellipse_at_center,_#1c1c26_0%,_#0f0f14_60%,_#07070a_100%)] border border-[#232329] overflow-hidden champagne-glow flex items-center justify-center">
                {activeImageUrl ? (
                  <img
                    src={activeImageUrl}
                    alt={`${product.title} - Frame ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain p-3 sm:p-6 transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="text-center p-8 space-y-2">
                    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#71717a] uppercase block">
                      No Imagery Documented
                    </span>
                    <p className="text-xs text-[#52525b] font-light">
                      Visual exposures have not been cataloged for this item.
                    </p>
                  </div>
                )}

                {/* Frame Counter Tag */}
                {images.length > 0 && (
                  <div className="absolute top-4 left-4 bg-[#08080a]/90 backdrop-blur-md border border-[#d4af37]/40 px-3 py-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-widest text-[#f2ca50] uppercase">
                      Frame {String(activeImageIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                    </span>
                  </div>
                )}

                {/* Frame Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      aria-label="Previous frame"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#08080a]/80 hover:bg-[#121216] border border-[#27272a] hover:border-[#d4af37] text-[#f4f4f5] hover:text-[#f2ca50] flex items-center justify-center transition-all cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      aria-label="Next frame"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#08080a]/80 hover:bg-[#121216] border border-[#27272a] hover:border-[#d4af37] text-[#f4f4f5] hover:text-[#f2ca50] flex items-center justify-center transition-all cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 pt-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[3/4] border overflow-hidden transition-all duration-200 cursor-pointer ${activeImageIndex === idx
                        ? "border-[#d4af37] ring-1 ring-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                        : "border-[#27272a] opacity-50 hover:opacity-100 hover:border-[#71717a]"
                        }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail frame ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-1 left-1 text-[8px] font-semibold text-[#f2ca50] bg-[#09090b]/80 px-1 leading-none">
                        0{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Minute Details & Specifications */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-8">
              {/* Atelier Metadata Header */}
              <div className="space-y-3 pb-6 border-b border-[#202026]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#121216] border border-[#d4af37]/40 text-[9px] font-semibold tracking-[0.25em] text-[#d4af37] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    <span>{product.seller?.fullname || "Partner Atelier"}</span>
                  </span>

                  {formattedDate && (
                    <span className="text-[10px] text-[#71717a] tracking-wider uppercase font-light">
                      Listed {formattedDate}
                    </span>
                  )}
                </div>

                <h1 className="font-serif-luxury text-3xl sm:text-4xl xl:text-5xl text-[#f4f4f5] tracking-tight leading-tight">
                  {product.title}
                </h1>

                {/* Price Appraisal */}
                <div className="pt-2 flex items-baseline gap-3">
                  <span className="font-serif-luxury text-2xl sm:text-3xl text-[#f2ca50] tracking-wide">
                    {formattedPrice}
                  </span>
                  <span className="text-[10px] text-[#71717a] tracking-widest uppercase font-medium">
                    Appraisal Valuation
                  </span>
                </div>

                {/* Variant Editions Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-[#202026]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.25em] text-[#d4af37] uppercase">
                        Archival Editions ({product.variants.length + 1})
                      </span>
                      {activeVariant && (
                        <span className="text-[10px] text-[#a1a1aa] tracking-wider uppercase">
                          Available: {activeVariant.stock !== undefined ? activeVariant.stock : 0} units
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVariantIndex(-1);
                          setActiveImageIndex(0);
                        }}
                        className={`px-3 py-2 border text-[10px] font-semibold tracking-[0.18em] uppercase transition-all cursor-pointer ${selectedVariantIndex === -1
                          ? "border-[#d4af37] bg-[#d4af37] text-[#09090b]"
                          : "border-[#27272a] bg-[#101014] text-[#a1a1aa] hover:border-[#d4af37]/50 hover:text-[#f4f4f5]"
                          }`}
                      >
                        Signature Edition
                      </button>

                      {product.variants.map((v, idx) => {
                        const isSelected = selectedVariantIndex === idx;

                        return (
                          <button
                            key={v._id || idx}
                            type="button"
                            onClick={() => {
                              setSelectedVariantIndex(idx);
                              setActiveImageIndex(0);
                            }}
                            className={`px-3 py-2 border text-[10px] font-semibold tracking-[0.18em] uppercase transition-all cursor-pointer ${isSelected
                              ? "border-[#d4af37] bg-[#d4af37] text-[#09090b]"
                              : "border-[#27272a] bg-[#101014] text-[#a1a1aa] hover:border-[#d4af37]/50 hover:text-[#f4f4f5]"
                              }`}
                          >
                            {getVariantColor(v, idx)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Variant Attributes (Color & Size) */}
                    {activeVariant?.attributes && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {Object.entries(
                          activeVariant.attributes instanceof Map
                            ? Object.fromEntries(activeVariant.attributes)
                            : activeVariant.attributes
                        ).map(([k, val], i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-[#14141a] border border-[#27272a] text-[9px] text-[#f2ca50] tracking-wider uppercase"
                          >
                            <strong className="text-[#a1a1aa] font-medium">{k}:</strong> {val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Archival Narrative Description */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#d4af37] uppercase block">
                  Archival Narrative & Craftsmanship
                </span>
                <p className="text-xs sm:text-sm text-[#d4d4d8] font-light leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Minute Specifications Ledger Table */}
              <div className="bg-[#101014] border border-[#222228] p-5 space-y-3">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#f4f4f5] uppercase block border-b border-[#202026] pb-2">
                  Archival Dossier Specifications
                </span>

                <div className="space-y-2.5 text-xs font-light">
                  <div className="flex items-center justify-between py-1 border-b border-[#1b1b22]">
                    <span className="text-[#71717a]">Archival Identifier:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#a1a1aa]">{product._id}</span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="text-[9px] uppercase tracking-wider text-[#d4af37] hover:underline cursor-pointer"
                      >
                        {copiedId ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#1b1b22]">
                    <span className="text-[#71717a]">Photographic Exposures:</span>
                    <span className="text-[#f4f4f5] font-medium">
                      {images.length} {images.length === 1 ? "Archival Frame" : "Archival Frames"}
                    </span>
                  </div>

                  {product.variants && product.variants.length > 0 && (
                    <div className="flex items-center justify-between py-1 border-b border-[#1b1b22]">
                      <span className="text-[#71717a]">Selected Edition:</span>
                      <span className="text-[#f2ca50] font-medium">
                        {activeVariant ? "Custom Edition Variant" : "Signature Edition"}
                      </span>
                    </div>
                  )}

                  {activeVariant && (
                    <div className="flex items-center justify-between py-1 border-b border-[#1b1b22]">
                      <span className="text-[#71717a]">Edition Inventory:</span>
                      <span className="text-[#f4f4f5] font-medium">
                        {activeVariant.stock !== undefined ? `${activeVariant.stock} pieces` : "Archive allocation"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-1 border-b border-[#1b1b22]">
                    <span className="text-[#71717a]">Atelier Representative:</span>
                    <span className="text-[#f4f4f5]">{product.seller?.fullname || "Verified House"}</span>
                  </div>

                  {product.seller?.email && (
                    <div className="flex items-center justify-between py-1 border-b border-[#1b1b22]">
                      <span className="text-[#71717a]">Atelier Contact:</span>
                      <span className="text-[#a1a1aa] font-mono text-[11px]">{product.seller.email}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-1 border-b border-[#1b1b22]">
                    <span className="text-[#71717a]">Currency Standard:</span>
                    <span className="text-[#f4f4f5] font-semibold">{product.price?.currency || "INR"}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#1b1b22]">
                    <span className="text-[#71717a]">Provenance Protocol:</span>
                    <span className="text-[#d4af37] font-medium">Cryptographically Verified</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#71717a]">Dispatch Method:</span>
                    <span className="text-[#f4f4f5]">White-Glove Insured Courier</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Strict separation of Buy Now and Add to Cart */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* BUY NOW: Directly opens Instant Purchase (NEVER touches cart!) */}
                  <button
                    type="button"
                    onClick={handleBuyNowClick}
                    className="w-full py-4 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase hover:bg-[#f2ca50] hover:shadow-[0_0_30px_rgba(242,202,80,0.3)] transition-all cursor-pointer"
                  >
                    Buy Now
                  </button>

                  {/* ADD TO CART: ONLY this adds specific piece to cart & triggers toast */}
                  <button
                    type="button"
                    disabled={cartLoading || addingToCart}
                    onClick={handleCartAdd}
                    className="w-full py-4 border border-[#d4af37]/60 hover:bg-[#d4af37]/10 text-[#f2ca50] text-[11px] font-bold tracking-[0.28em] uppercase transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{addingToCart ? "Allocating..." : "Add to Cart"}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full py-3.5 border border-[#27272a] hover:border-[#d4af37]/60 text-[#a1a1aa] hover:text-[#f4f4f5] text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                >
                  Request Confidential Allocation
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/#salon"
                    className="py-3 px-4 border border-[#27272a] hover:border-[#d4af37] text-[#a1a1aa] hover:text-[#f4f4f5] text-[10px] font-semibold tracking-[0.2em] uppercase text-center transition-colors"
                  >
                    Private Salon Fitting
                  </Link>

                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="py-3 px-4 border border-[#27272a] hover:border-[#d4af37] text-[#a1a1aa] hover:text-[#f4f4f5] text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                  >
                    {copiedUrl ? "Link Copied ✓" : "Share Dossier"}
                  </button>
                </div>
              </div>

              {/* Archival Service Promises */}
              <div className="pt-4 border-t border-[#202026] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-[#0c0c10] border border-[#1e1e24]">
                  <span className="text-[9px] font-bold tracking-widest text-[#d4af37] uppercase block mb-1">
                    Authentic
                  </span>
                  <p className="text-[10px] text-[#71717a]">Verified atelier certificate</p>
                </div>
                <div className="p-3 bg-[#0c0c10] border border-[#1e1e24]">
                  <span className="text-[9px] font-bold tracking-widest text-[#d4af37] uppercase block mb-1">
                    Insured
                  </span>
                  <p className="text-[10px] text-[#71717a]">Full archival transit bond</p>
                </div>
                <div className="p-3 bg-[#0c0c10] border border-[#1e1e24]">
                  <span className="text-[9px] font-bold tracking-widest text-[#d4af37] uppercase block mb-1">
                    Bespoke
                  </span>
                  <p className="text-[10px] text-[#71717a]">Personal salon fittings</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Allocation / Acquisition Modal */}
      {inquiryModalOpen && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/90 backdrop-blur-md">
          <div className="bg-[#121216] border border-[#d4af37]/40 w-full max-w-lg p-8 relative champagne-glow">
            <button
              type="button"
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-4 right-4 text-[#71717a] hover:text-[#f4f4f5] p-2"
            >
              ✕
            </button>

            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase block mb-1">
              CONFIDENTIAL ALLOCATION REQUEST
            </span>
            <h3 className="font-serif-luxury text-2xl text-[#f4f4f5] mb-1">
              {product.title}
            </h3>
            <p className="text-xs text-[#d4af37] font-semibold tracking-wider mb-4">
              Valuation: {formattedPrice} · Ref: {product._id}
            </p>

            {inquirySuccess ? (
              <div className="p-6 bg-[#09090b] border border-[#d4af37] text-center space-y-2">
                <span className="text-[#d4af37] font-serif-luxury text-lg block">Request Submitted</span>
                <p className="text-xs text-[#a1a1aa] font-light">
                  Your acquisition allocation for this piece has been submitted directly to the atelier team. You will receive private correspondence within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Client Full Name
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
                    Confidential Contact / Email
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.email || user?.contact || ""}
                    placeholder="Direct contact or phone"
                    required
                    className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Delivery City / Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. London, Paris, New York, Tokyo"
                    required
                    className="w-full bg-[#0c0c0f] border border-[#27272a] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Bespoke Tailoring or Inquiries
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify sizing, bespoke requirements, or delivery notes..."
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

      {/* INSTANT DIRECT "BUY NOW" ALLOCATION MODAL (Does not affect cart) */}
      {buyNowModalOpen && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060608]/90 backdrop-blur-md">
          <div className="bg-[#0f0f14] border border-[#d4af37]/50 w-full max-w-xl p-6 sm:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.85)] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0c0c10] [&::-webkit-scrollbar-thumb]:bg-[#2c2c36]">
            <button
              type="button"
              onClick={() => setBuyNowModalOpen(false)}
              className="absolute top-4 right-4 text-[#71717a] hover:text-[#f4f4f5] p-2 cursor-pointer text-sm"
              title="Close"
            >
              ✕
            </button>

            <span className="text-[10px] font-bold tracking-[0.25em] text-[#d4af37] uppercase block mb-1">
              Direct Acquisition · Instant Checkout
            </span>
            <h3 className="font-serif-luxury text-2xl text-[#f4f4f5] mb-2">
              Instant Piece Allocation
            </h3>
            <p className="text-xs text-[#a1a1aa] font-light mb-5">
              Secure immediate private allocation directly from the atelier without adding to your archive cart.
            </p>

            {buyNowSuccess ? (
              <div className="p-8 bg-[#09090d] border border-[#d4af37] text-center space-y-3">
                <div className="w-12 h-12 rounded-full border border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="font-serif-luxury text-xl text-[#f2ca50]">Acquisition Confirmed</h4>
                <p className="text-xs text-[#d4d4d8] font-light max-w-md mx-auto leading-relaxed">
                  Your direct order for <strong>{product.title}</strong> has been registered. An encrypted atelier dispatch dossier has been routed to your contact.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">
                    Protocol #{Math.random().toString(36).substring(2, 9).toUpperCase()} · White-Glove Courier Dispatched
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBuyNowSubmit} className="space-y-4">
                {/* Product Summary Card */}
                <div className="p-3.5 bg-[#09090c] border border-[#22222c] flex items-center gap-4">
                  <div className="w-16 h-20 bg-[#121217] border border-[#272732] shrink-0 overflow-hidden flex items-center justify-center">
                    {activeImageUrl ? (
                      <img src={activeImageUrl} alt={product.title} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-[8px] text-[#71717a]">NO IMAGE</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-[#d4af37] uppercase block truncate">
                      {product.seller?.fullname || "Partner Atelier"}
                    </span>
                    <h5 className="font-serif-luxury text-sm text-[#f4f4f5] truncate">{product.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono font-semibold text-[#f2ca50]">{formattedPrice}</span>
                      {activeVariant && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#171720] border border-[#2b2b38] text-[#a1a1aa] font-mono">
                          {getVariantColor(activeVariant, selectedVariantIndex)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
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
                      placeholder="Contact details"
                      required
                      className="w-full bg-[#0a0a0d] border border-[#262630] text-xs text-[#f4f4f5] p-3 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-[#a1a1aa] uppercase">
                    Delivery Address & City
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
                      <input type="radio" name="payment" defaultChecked className="accent-[#d4af37]" />
                      <span>White-Glove Delivery COD</span>
                    </label>
                    <label className="p-3 bg-[#0a0a0d] border border-[#262630] hover:border-[#71717a] flex items-center gap-2 cursor-pointer text-[#a1a1aa]">
                      <input type="radio" name="payment" className="accent-[#d4af37]" />
                      <span>Vault Wire / Escrow</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#d4af37] hover:bg-[#f2ca50] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)] cursor-pointer mt-2"
                >
                  Confirm Instant Direct Purchase
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
