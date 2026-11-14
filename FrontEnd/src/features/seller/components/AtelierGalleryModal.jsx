import { useState, useMemo, useEffect, useCallback } from "react";

const extractImageUrls = (product) => {
  if (!product?.images || !Array.isArray(product.images)) return [];
  return product.images
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);
};

export default function AtelierGalleryModal({ product, initialIndex = 0, onClose }) {
  const [modalIndex, setModalIndex] = useState(initialIndex);
  const images = useMemo(() => extractImageUrls(product), [product]);

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

        <div className="relative max-h-[62vh] sm:max-h-[70vh] max-w-4xl w-full flex items-center justify-center">
          <img
            src={currentImg}
            alt={`${product.title} - Frame ${modalIndex + 1}`}
            className="max-h-[62vh] sm:max-h-[70vh] w-auto max-w-full object-contain border border-[#232329] champagne-glow"
          />
        </div>

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
                <span className="absolute bottom-1 right-1 text-[8px] font-semibold bg-[#09090b]/90 text-[#f2ca50] px-1 leading-none">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>

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

