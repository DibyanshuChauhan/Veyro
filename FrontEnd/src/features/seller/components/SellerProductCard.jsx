import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const extractImageUrls = (product) => {
  if (!product?.images || !Array.isArray(product.images)) return [];
  return product.images
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);
};

export default function SellerProductCard({ product, onOpenGallery }) {
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
            {product.variants && product.variants.length > 0 && (
              <span className="px-2 py-1 bg-[#09090b]/85 backdrop-blur-sm border border-[#d4af37]/40 text-[9px] font-semibold tracking-wider text-[#d4af37] uppercase">
                {product.variants.length} {product.variants.length === 1 ? "Variant" : "Variants"}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
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

          {/* Carousel Left / Right Arrows */}
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

          {/* Carousel Indicators */}
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
              {product.price?.currency || "INR"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/products/edit/${product._id}`}
            className="px-3.5 py-2 border border-[#d4af37]/50 hover:border-[#d4af37] text-[10px] font-semibold tracking-[0.2em] text-[#f2ca50] hover:text-[#09090b] hover:bg-[#d4af37] transition-all uppercase inline-flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onOpenGallery(product, activeImageIndex)}
            className="px-3.5 py-2 border border-[#27272a] hover:border-[#d4af37] text-[10px] font-semibold tracking-[0.2em] text-[#a1a1aa] hover:text-[#f4f4f5] transition-all uppercase cursor-pointer"
          >
            View All ({images.length})
          </button>
        </div>
      </div>
    </article>
  );
}

