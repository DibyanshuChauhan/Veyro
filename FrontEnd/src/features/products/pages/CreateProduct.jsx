import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useAuth } from "../../auth/hook/useAuth";
import AuthHeader from "../../auth/components/AuthHeader";
import AuthFooter from "../../auth/components/AuthFooter";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR"];
const MAX_IMAGES = 7;

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleAddProducts } = useProduct();
  const { user, isSeller } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });
  const [images, setImages] = useState([]); // Array of { file, preview }
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);

    if (accepted.length === 0) return;

    const newImages = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (errorMessage) setErrorMessage("");
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Enforce that user is a seller
    if (!isSeller) {
      setErrorMessage("Only authenticated Atelier Sellers have the right to create and list products.");
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      setErrorMessage("Creation Title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage("Archival Description is required.");
      return;
    }

    const numericPrice = parseFloat(formData.priceAmount);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setErrorMessage("Acquisition Value must be a positive number.");
      return;
    }

    if (images.length === 0) {
      setErrorMessage("Please upload at least 1 product image (up to 7 frames).");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("priceAmount", formData.priceAmount);
      payload.append("priceCurrency", formData.priceCurrency);
      images.forEach((img) => payload.append("images", img.file));

      await handleAddProducts(payload);
      setSuccessMessage("Product listed successfully in the Atelier!");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      const validationErrors = err?.response?.data?.errors;
      const errorText =
        (Array.isArray(validationErrors) && validationErrors.length > 0
          ? validationErrors.map(({ msg }) => msg).join(" ")
          : null) ||
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to list product. Please verify your connection.";
      setErrorMessage(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury selection:bg-[#d4af37] selection:text-[#09090b]">
      {/* Header */}
      <AuthHeader actionLabel="Dashboard" actionTo="/" />

      {/* Main Content */}
      <main className="grow flex justify-center px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <div className="w-full max-w-3xl">

          {/* Breadcrumb & Seller Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <nav className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-[#71717a] uppercase">
              <Link to="/" className="hover:text-[#d4af37] transition-colors">Atelier</Link>
              <span className="text-[#2e2e35]">/</span>
              <span className="text-[#a1a1aa]">Create Product</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121216] border border-[#d4af37]/40 text-[9px] font-semibold tracking-[0.25em] text-[#f2ca50] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span>Verified Atelier Seller: {user?.fullname || "Partner"}</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#121216] border border-[#232329] champagne-glow relative">
            {/* Gold Hairline Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#d4af37] to-transparent opacity-90" />

            <div className="p-8 sm:p-12 lg:p-14">
              {/* Form Header */}
              <header className="mb-9 pb-7 border-b border-[#1e1e24]">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2.5 h-px bg-[#d4af37]" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                    Seller Atelier Registry
                  </span>
                </div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#f4f4f5] tracking-wide mb-2.5">
                  List a New Creation
                </h1>
                <p className="text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed max-w-xl">
                  Required fields for certified archival registration: title, description, acquisition price, currency, and imagery (up to 7 frames).
                </p>
              </header>

              {/* Status Notifications */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-[#1c0f10] border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-start gap-3">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-6 p-4 bg-[#101b12] border border-[#4ade80]/40 text-[#4ade80] text-xs flex items-start gap-3">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-7">

                {/* ── Field 1: Title (Required) ── */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                  >
                    Creation Title <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative flex items-center border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/30 transition-all duration-200">
                    <span className="pl-4 pr-3 text-[#71717a] flex items-center pointer-events-none shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </span>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Obsidian Silk Evening Gown"
                      className="w-full bg-transparent py-3.5 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light"
                    />
                  </div>
                </div>

                {/* ── Field 2: Description (Required) ── */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                  >
                    Archival Description <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/30 transition-all duration-200">
                    <span className="absolute top-3.5 left-4 text-[#71717a] pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </span>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the silhouette, materials, atelier craftsmanship, and provenance..."
                      className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* ── Fields 3 & 4: Price Amount & Currency (Both Required) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Price Amount */}
                  <div className="space-y-2">
                    <label
                      htmlFor="priceAmount"
                      className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                    >
                      Acquisition Value <span className="text-[#d4af37]">*</span>
                    </label>
                    <div className="relative flex items-center border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/30 transition-all duration-200">
                      <span className="pl-4 pr-3 text-[#71717a] flex items-center pointer-events-none shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <input
                        id="priceAmount"
                        name="priceAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        value={formData.priceAmount}
                        onChange={handleChange}
                        placeholder="1850.00"
                        className="w-full bg-transparent py-3.5 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wider font-light"
                      />
                    </div>
                  </div>

                  {/* Price Currency */}
                  <div className="space-y-2">
                    <label
                      htmlFor="priceCurrency"
                      className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                    >
                      Currency <span className="text-[#d4af37]">*</span>
                    </label>
                    <div className="relative border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/30 transition-all duration-200">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                        </svg>
                      </span>
                      <select
                        id="priceCurrency"
                        name="priceCurrency"
                        required
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        className="w-full bg-transparent py-3.5 pl-11 pr-10 text-sm text-[#f4f4f5] border-0 focus:outline-none focus:ring-0 tracking-wider font-light appearance-none cursor-pointer"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c} className="bg-[#121216] text-[#f4f4f5]">
                            {c}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37] pointer-events-none">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Field 5: Product Images (Required, Up to 7) ── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase">
                      Product Imagery <span className="text-[#d4af37]">*</span>
                    </label>
                    <span className="text-[9px] tracking-wider text-[#d4af37] uppercase">
                      {images.length} / {MAX_IMAGES} frames uploaded
                    </span>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed transition-all duration-200 py-9 px-6 flex flex-col items-center justify-center gap-3 cursor-pointer
                      ${isDragOver
                        ? "border-[#d4af37] bg-[#d4af37]/5"
                        : images.length < MAX_IMAGES
                        ? "border-[#27272a] bg-[#0c0c0f] hover:border-[#d4af37]/50 hover:bg-[#d4af37]/3"
                        : "border-[#1e1e24] bg-[#0a0a0d] cursor-not-allowed opacity-60"
                      }`}
                  >
                    <svg className="w-7 h-7 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm font-medium text-[#f4f4f5] tracking-wide">
                        {isDragOver ? "Drop image frames to upload" : "Upload Atelier Imagery"}
                      </p>
                      <p className="text-[10px] text-[#71717a] tracking-widest uppercase mt-1">
                        1 to {MAX_IMAGES} frames required · JPEG, PNG, WEBP (Max 5MB each)
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
                    />
                  </div>

                  {/* 7 Horizontal Frame Preview Slots */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: MAX_IMAGES }).map((_, idx) => {
                      const img = images[idx];
                      return img ? (
                        <div key={idx} className="relative aspect-square border border-[#d4af37]/60 bg-[#0c0c0f] overflow-hidden group">
                          <img
                            src={img.preview}
                            alt={`Archival frame ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute inset-0 bg-[#09090b]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            aria-label={`Remove frame ${idx + 1}`}
                          >
                            <svg className="w-4 h-4 text-[#ffb4ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <span className="absolute bottom-1 left-1 text-[8px] font-semibold tracking-widest text-[#f2ca50] bg-[#09090b]/80 px-1 leading-none">
                            0{idx + 1}
                          </span>
                        </div>
                      ) : (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={images.length >= MAX_IMAGES}
                          className="aspect-square border border-[#27272a] bg-[#0c0c0f] hover:border-[#d4af37]/40 transition-colors flex flex-col items-center justify-center gap-0.5 group disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <span className="text-[#3f3f46] group-hover:text-[#d4af37] transition-colors text-base leading-none">+</span>
                          <span className="text-[8px] font-semibold tracking-widest text-[#52525b] leading-none">
                            0{idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Submission (Required Action Only) ── */}
                <div className="pt-4 border-t border-[#1e1e24] space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[#f2ca50] hover:shadow-[0_0_30px_rgba(242,202,80,0.35)] active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? "PUBLISHING TO ATELIER..." : "PUBLISH TO ATELIER"}</span>
                    {!isSubmitting && (
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>

                  <p className="text-[10px] text-[#52525b] leading-relaxed tracking-wide text-center">
                    Protected under VEYRO Archival Protocol & Digital Authenticity Ledger.
                  </p>
                </div>

              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
};

export default CreateProduct;
