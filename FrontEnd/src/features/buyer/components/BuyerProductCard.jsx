import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../cart/hook/useCart";
import { useAuth } from "../../auth/hook/useAuth";

export default function BuyerProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleAddToCart, loading: cartLoading } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [adding, setAdding] = useState(false);

  const handleCartAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product?._id) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    const firstVariantId = product?.variants?.[0]?._id || null;
    await handleAddToCart({
      productId: product._id,
      variantId: firstVariantId,
      quantity: 1,
      toastMeta: {
        title: product.title,
        edition: product.seller?.fullname || "Archival Atelier",
        imageUrl: activeImageUrl,
        price: product.price?.amount,
        currency: product.price?.currency
      }
    });
    setAdding(false);
  };

  const images = useMemo(() => {
    if (!product?.images || !Array.isArray(product.images)) return [];
    return product.images
      .map((img) => (typeof img === "string" ? { url: img } : img))
      .filter((img) => Boolean(img?.url));
  }, [product?.images]);

  const activeImageUrl = images[activeImageIndex]?.url;

  const formattedPrice = useMemo(() => {
    const amt = Number(product?.price?.amount || 0);
    const curr = product?.price?.currency || "INR";
    return `${curr} ${amt.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  }, [product?.price]);

  return (
    <div className="group bg-[#111115] border border-[#222228] hover:border-[#d4af37]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden champagne-glow">
      <Link to={`/products/${product._id}`} className="relative aspect-[3/4] bg-[#0c0c10] overflow-hidden block">
        {activeImageUrl ? (
          <img
            src={activeImageUrl}
            alt={product.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-[#71717a]">
            No Imagery Recorded
          </div>
        )}

        <div className="absolute top-3 left-3 bg-[#08080a]/90 backdrop-blur-md border border-[#d4af37]/40 px-3 py-1">
          <span className="text-[10px] font-bold tracking-widest text-[#f2ca50] uppercase">
            {formattedPrice}
          </span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === idx ? "bg-[#d4af37] w-4" : "bg-[#f4f4f5]/40 hover:bg-[#f4f4f5]"
                  }`}
              />
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="absolute top-3 right-3 bg-[#08080a]/80 backdrop-blur-sm border border-[#27272a] px-2 py-0.5">
            <span className="text-[9px] font-medium tracking-widest text-[#a1a1aa] uppercase">
              {images.length} {images.length === 1 ? "Frame" : "Frames"}
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col grow justify-between space-y-4">
        <div>
          <span className="text-[9px] font-semibold tracking-[0.25em] text-[#d4af37] uppercase block mb-1">
            {product.seller?.fullname || "Partner Atelier"}
          </span>
          <Link to={`/products/${product._id}`}>
            <h3 className="font-serif-luxury text-lg text-[#f4f4f5] tracking-wide line-clamp-1 group-hover:text-[#f2ca50] transition-colors">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-[#a1a1aa] font-light mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-[#202026] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* BUY NOW: Directly navigates to Product page instant buy, DOES NOT touch cart */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/products/${product._id}?buyNow=1`);
              }}
              className="py-2.5 px-3 bg-[#d4af37] hover:bg-[#f2ca50] text-[#09090b] text-[10px] font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer text-center"
            >
              Buy Now
            </button>
            {/* ADD TO CART: ONLY this button adds to cart & triggers toast */}
            <button
              type="button"
              disabled={cartLoading || adding}
              onClick={(e) => handleCartAdd(e)}
              className="py-2.5 px-3 border border-[#d4af37]/60 hover:bg-[#d4af37]/10 text-[#f2ca50] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{adding ? "Adding..." : "Add to Cart"}</span>
            </button>
          </div>
          <Link
            to={`/products/${product._id}`}
            className="block w-full py-2 px-3 border border-[#27272a] hover:border-[#d4af37]/60 text-[#a1a1aa] hover:text-[#f4f4f5] text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

