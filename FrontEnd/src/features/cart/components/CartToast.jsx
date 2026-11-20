import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useCart } from "../hook/useCart";

/**
 * Luxury Archival Cart Toast Notification
 * Rendered via createPortal directly into document.body to prevent
 * any ancestor CSS containing block / backdrop-filter clipping.
 * Positioned cleanly at the top-right just beneath the header navigation.
 */
export default function CartToast() {
  const { toast, totalItems, handleDismissToast } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!toast) return;

    // Automatically dismiss the toast after 4.5 seconds
    const timer = setTimeout(() => {
      handleDismissToast();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, handleDismissToast]);

  if (!mounted || !toast) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-8 z-[999999] max-w-sm w-[calc(100vw-2rem)] transition-all duration-300 ease-out"
    >
      <div className="bg-[#0e0e14] border border-[#d4af37]/60 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-xl relative">
        {/* Gold Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#d4af37]" />

        {/* Header line: Status & Dismiss */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#1f1f28]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center text-[10px] font-bold">
              ✓
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase font-mono">
              Allocated to Archival Bag
            </span>
          </div>

          <button
            type="button"
            onClick={handleDismissToast}
            className="text-[#71717a] hover:text-[#f4f4f5] p-1 text-xs cursor-pointer transition-colors"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>

        {/* Piece Details: Thumbnail + Info */}
        <div className="flex gap-3.5 items-center">
          <div className="w-14 h-18 bg-[radial-gradient(ellipse_at_center,_#1c1c26_0%,_#0f0f14_60%,_#07070a_100%)] border border-[#272734] shrink-0 overflow-hidden p-1 flex items-center justify-center">
            {toast.imageUrl ? (
              <img
                src={toast.imageUrl}
                alt={toast.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[7px] font-mono text-[#71717a] uppercase">
                Piece
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-serif-luxury text-sm text-[#f4f4f5] truncate">
              {toast.title}
            </h4>

            {toast.edition && (
              <span className="text-[9px] text-[#a1a1aa] font-mono block truncate mt-0.5">
                {toast.edition}
              </span>
            )}

            {toast.price && (
              <span className="text-xs text-[#f2ca50] font-mono font-medium block mt-1">
                {toast.currency || "INR"} {Number(toast.price).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Button: View Full Dedicated Cart */}
        <div className="mt-3.5 pt-2.5 border-t border-[#1c1c24] flex items-center gap-2">
          <Link
            to="/cart"
            onClick={handleDismissToast}
            className="flex-1 py-2.5 px-3 bg-[#d4af37] hover:bg-[#f2ca50] text-[#09090b] text-[10px] font-bold tracking-[0.2em] uppercase transition-colors text-center font-mono flex items-center justify-center gap-1.5"
          >
            <span>View Archival Bag ({totalItems})</span>
            <span>→</span>
          </Link>

          <button
            type="button"
            onClick={handleDismissToast}
            className="py-2.5 px-3 border border-[#272732] hover:border-[#71717a] text-[#a1a1aa] hover:text-[#f4f4f5] text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Timed progress animation bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a24] overflow-hidden">
          <div className="h-full bg-[#d4af37]/70 animate-[shrink_4.5s_linear_forwards]" />
        </div>
      </div>
    </div>,
    document.body
  );
}
