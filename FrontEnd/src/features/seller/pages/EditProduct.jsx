import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../products/hook/useProduct";
import { useAuth } from "../../auth/hook/useAuth";
import AuthHeader from "../../auth/components/AuthHeader";
import AuthFooter from "../../auth/components/AuthFooter";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];
const MAX_IMAGES = 7;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById, handleUpdateProduct, loading: productLoading } = useProduct();
  const { user, isSeller } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
    stock: "1",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fetchingProduct, setFetchingProduct] = useState(true);

  useEffect(() => {
    if (id) {
      setFetchingProduct(true);
      handleGetProductById(id)
        .then((prod) => {
          if (prod) {
            setFormData({
              title: prod.title || "",
              description: prod.description || "",
              priceAmount: prod.price?.amount ? String(prod.price.amount) : "",
              priceCurrency: prod.price?.currency || "INR",
              stock: prod.stock !== undefined ? String(prod.stock) : "1",
            });
            const imgs = Array.isArray(prod.images)
              ? prod.images.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
              : [];
            setExistingImages(imgs);

            const initialVariants = (prod.variants || []).map((v) => {
              let attrs = [];
              if (v.attributes) {
                if (v.attributes instanceof Map) {
                  attrs = Array.from(v.attributes.entries()).map(([key, value]) => ({ key, value }));
                } else if (typeof v.attributes === "object") {
                  attrs = Object.entries(v.attributes).map(([key, value]) => ({ key, value }));
                }
              }
              return {
                id: v._id || Math.random().toString(),
                stock: v.stock !== undefined ? String(v.stock) : "0",
                priceAmount: v.price?.amount ? String(v.price.amount) : "",
                priceCurrency: v.price?.currency || prod.price?.currency || "INR",
                attributes: attrs.length > 0 ? attrs : [{ key: "Size", value: "" }],
                existingImages: Array.isArray(v.images)
                  ? v.images.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
                  : [],
                newImages: [],
              };
            });
            setVariants(initialVariants);
          }
        })
        .catch((err) => {
          setErrorMsg(err?.message || "Failed to retrieve creation details");
        })
        .finally(() => {
          setFetchingProduct(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const addFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    const availableSlots = MAX_IMAGES - (newImages.length + existingImages.length);

    if (availableSlots <= 0) {
      setErrorMsg(`Maximum of ${MAX_IMAGES} frames reached.`);
      return;
    }

    const toProcess = incoming.slice(0, availableSlots);
    const valid = [];

    for (const file of toProcess) {
      if (!file.type.startsWith("image/")) {
        setErrorMsg(`"${file.name}" is not an image file.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds the 5MB archival limit.`);
        return;
      }
      valid.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setErrorMsg("");
    setNewImages((prev) => [...prev, ...valid]);
  };

  const removeNewImage = (idxToRemove) => {
    setNewImages((prev) => {
      const target = prev[idxToRemove];
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, idx) => idx !== idxToRemove);
    });
  };

  const removeExistingImage = (idxToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const addVariant = () => {
    setVariants((prev) => {
      const lastVariant = prev[prev.length - 1];
      const prevSize =
        lastVariant?.attributes?.find((a) => /size/i.test(a.key))?.value || "";

      return [
        ...prev,
        {
          id: Date.now() + Math.random().toString(),
          stock: lastVariant ? lastVariant.stock : "1",
          priceAmount: lastVariant?.priceAmount || formData.priceAmount || "",
          priceCurrency: lastVariant?.priceCurrency || formData.priceCurrency || "INR",
          attributes: [
            { key: "Color", value: "" },
            { key: "Size", value: prevSize }
          ],
          existingImages: [],
          newImages: []
        }
      ];
    });
  };

  const duplicateVariant = (variantIndex) => {
    setVariants((prev) => {
      const source = prev[variantIndex];
      if (!source) return prev;
      const clone = {
        id: Date.now() + Math.random().toString(),
        stock: source.stock,
        priceAmount: source.priceAmount,
        priceCurrency: source.priceCurrency,
        attributes: source.attributes.map((a) => ({ ...a })),
        existingImages: [...(source.existingImages || [])],
        newImages: []
      };
      const copy = [...prev];
      copy.splice(variantIndex + 1, 0, clone);
      return copy;
    });
  };

  const removeVariant = (variantIndex) => {
    setVariants((prev) => {
      const target = prev[variantIndex];
      target?.newImages?.forEach((img) => URL.revokeObjectURL(img.preview));
      return prev.filter((_, idx) => idx !== variantIndex);
    });
  };

  const updateVariantField = (variantIndex, field, value) => {
    setVariants((prev) =>
      prev.map((v, idx) => (idx === variantIndex ? { ...v, [field]: value } : v))
    );
  };

  const addVariantAttribute = (variantIndex) => {
    setVariants((prev) =>
      prev.map((v, idx) => {
        if (idx !== variantIndex) return v;
        return {
          ...v,
          attributes: [...v.attributes, { key: "", value: "" }]
        };
      })
    );
  };

  const updateVariantAttribute = (variantIndex, attrIndex, field, value) => {
    setVariants((prev) =>
      prev.map((v, idx) => {
        if (idx !== variantIndex) return v;
        const updatedAttrs = v.attributes.map((attr, aIdx) =>
          aIdx === attrIndex ? { ...attr, [field]: value } : attr
        );
        return { ...v, attributes: updatedAttrs };
      })
    );
  };

  const removeVariantAttribute = (variantIndex, attrIndex) => {
    setVariants((prev) =>
      prev.map((v, idx) => {
        if (idx !== variantIndex) return v;
        return {
          ...v,
          attributes: v.attributes.filter((_, aIdx) => aIdx !== attrIndex)
        };
      })
    );
  };

  const handleVariantFiles = (variantIndex, fileList) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    const valid = [];
    for (const file of incoming) {
      if (!file.type.startsWith("image/")) continue;
      valid.push({
        file,
        preview: URL.createObjectURL(file)
      });
    }
    setVariants((prev) =>
      prev.map((v, idx) =>
        idx === variantIndex ? { ...v, newImages: [...v.newImages, ...valid] } : v
      )
    );
  };

  const removeVariantNewImage = (variantIndex, imgIndex) => {
    setVariants((prev) =>
      prev.map((v, idx) => {
        if (idx !== variantIndex) return v;
        const target = v.newImages[imgIndex];
        if (target?.preview) URL.revokeObjectURL(target.preview);
        return {
          ...v,
          newImages: v.newImages.filter((_, i) => i !== imgIndex)
        };
      })
    );
  };

  const removeVariantExistingImage = (variantIndex, imgIndex) => {
    setVariants((prev) =>
      prev.map((v, idx) => {
        if (idx !== variantIndex) return v;
        return {
          ...v,
          existingImages: v.existingImages.filter((_, i) => i !== imgIndex)
        };
      })
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isSeller) {
      setErrorMsg("Unauthorized: Only verified sellers can modify creations.");
      return;
    }

    if (!formData.title.trim()) {
      setErrorMsg("Creation title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg("Archival description is required.");
      return;
    }
    const parsedAmount = parseFloat(formData.priceAmount);
    if (!formData.priceAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg("Please specify a valid acquisition value greater than zero.");
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      setErrorMsg("At least one archival frame is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("priceAmount", parsedAmount.toString());
      data.append("priceCurrency", formData.priceCurrency);
      data.append("stock", (Number(formData.stock) >= 0 ? Number(formData.stock) : 0).toString());

      if (newImages.length > 0) {
        newImages.forEach((item) => {
          data.append("images", item.file);
        });
      }

      if (variants !== undefined) {
        const variantsPayload = variants.map((v) => ({
          stock: Number(v.stock) >= 0 ? Number(v.stock) : 0,
          price: {
            amount: parseFloat(v.priceAmount) > 0 ? parseFloat(v.priceAmount) : parsedAmount,
            currency: v.priceCurrency || formData.priceCurrency
          },
          attributes: v.attributes.reduce((acc, curr) => {
            if (curr.key && curr.key.trim()) {
              acc[curr.key.trim()] = String(curr.value || "").trim();
            }
            return acc;
          }, {}),
          images: (v.existingImages || []).map((url) => ({ url }))
        }));
        data.append("variants", JSON.stringify(variantsPayload));

        variants.forEach((v, vIdx) => {
          (v.newImages || []).forEach((item) => {
            data.append(`variant_${vIdx}_images`, item.file);
          });
        });
      }

      await handleUpdateProduct(id, data);

      newImages.forEach((img) => URL.revokeObjectURL(img.preview));
      variants.forEach((v) => {
        v.newImages?.forEach((img) => URL.revokeObjectURL(img.preview));
      });
      navigate("/dashboard");
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An unexpected error occurred while modifying the creation.";
      setErrorMsg(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury selection:bg-[#d4af37] selection:text-[#09090b]">
      <AuthHeader actionLabel="Dashboard" actionTo="/dashboard" />

      <main className="grow flex justify-center px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <div className="w-full max-w-3xl">
          {/* Breadcrumb & Top Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <nav className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-[#71717a] uppercase">
              <Link to="/dashboard" className="hover:text-[#d4af37] transition-colors">Dashboard</Link>
              <span className="text-[#2e2e35]">/</span>
              <span className="text-[#a1a1aa]">Edit Creation</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121216] border border-[#d4af37]/40 text-[9px] font-semibold tracking-[0.25em] text-[#f2ca50] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span>Atelier Identifier: {id}</span>
            </div>
          </div>

          {fetchingProduct ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#d4af37] tracking-[0.28em] uppercase font-light">
                Loading Creation Specifications...
              </p>
            </div>
          ) : (
            <div className="bg-[#121216] border border-[#232329] champagne-glow relative">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#d4af37] to-transparent opacity-90" />

              <div className="p-7 sm:p-11">
                <header className="mb-9 pb-7 border-b border-[#1e1e24]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-px bg-[#d4af37]" />
                    <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                      Modify Atelier Record
                    </span>
                  </div>
                  <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#f4f4f5] tracking-wide mb-2">
                    Edit Archival Creation
                  </h1>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed">
                    Update narrative descriptions, valuation currency, or upload refreshed photographic exposures.
                  </p>
                </header>

                {errorMsg && (
                  <div
                    role="alert"
                    className="mb-8 p-4 bg-[#1c0f10] border border-[#ffb4ab]/40 flex items-start gap-3 text-xs text-[#ffb4ab]"
                  >
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-light">{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Field 1: Title */}
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
                        className="w-full bg-transparent py-3.5 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light"
                      />
                    </div>
                  </div>

                  {/* Field 2: Description */}
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
                        className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Fields 3, 4 & 5: Price, Currency & Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          min="1"
                          step="any"
                          required
                          value={formData.priceAmount}
                          onChange={handleChange}
                          className="w-full bg-transparent py-3.5 pr-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="priceCurrency"
                        className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                      >
                        Valuation Currency <span className="text-[#d4af37]">*</span>
                      </label>
                      <div className="relative border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] transition-all duration-200">
                        <select
                          id="priceCurrency"
                          name="priceCurrency"
                          value={formData.priceCurrency}
                          onChange={handleChange}
                          className="w-full bg-transparent py-3.5 pl-4 pr-10 text-sm text-[#f4f4f5] border-0 focus:outline-none focus:ring-0 tracking-wider appearance-none cursor-pointer uppercase font-medium"
                        >
                          {CURRENCIES.map((curr) => (
                            <option key={curr} value={curr} className="bg-[#121216] text-[#f4f4f5]">
                              {curr} — Standard
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none text-xs">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="stock"
                        className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase"
                      >
                        Atelier Stock Count
                      </label>
                      <div className="relative flex items-center border border-[#27272a] bg-[#0c0c0f] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/30 transition-all duration-200">
                        <input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.stock || ""}
                          onChange={handleChange}
                          placeholder="e.g. 10"
                          className="w-full bg-transparent py-3.5 px-4 text-sm text-[#f4f4f5] placeholder:text-[#52525b] border-0 focus:outline-none focus:ring-0 tracking-wide font-light"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Field 5: Product Imagery */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-semibold tracking-[0.25em] text-[#a1a1aa] uppercase">
                        Product Imagery
                      </label>
                      <span className="text-[9px] tracking-wider text-[#d4af37] uppercase">
                        {existingImages.length + newImages.length} / {MAX_IMAGES} frames total
                      </span>
                    </div>

                    {/* Drag & Drop Zone for New Images */}
                    <div
                      onClick={() => existingImages.length + newImages.length < MAX_IMAGES && fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed transition-all duration-200 py-8 px-6 flex flex-col items-center justify-center gap-2 cursor-pointer
                        ${isDragOver
                          ? "border-[#d4af37] bg-[#d4af37]/5"
                          : existingImages.length + newImages.length < MAX_IMAGES
                          ? "border-[#27272a] bg-[#0c0c0f] hover:border-[#d4af37]/50 hover:bg-[#d4af37]/3"
                          : "border-[#1e1e24] bg-[#0a0a0d] cursor-not-allowed opacity-60"
                        }`}
                    >
                      <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs font-medium text-[#f4f4f5] tracking-wide">
                        Click or drop frames to add new exposures
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
                      />
                    </div>

                    {/* Frame Thumbnails Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2">
                      {existingImages.map((url, idx) => (
                        <div key={`exist-${idx}`} className="relative aspect-square border border-[#27272a] bg-[#0c0c0f] overflow-hidden group">
                          <img src={url} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx)}
                            className="absolute inset-0 bg-[#09090b]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            aria-label={`Remove existing frame ${idx + 1}`}
                          >
                            <svg className="w-4 h-4 text-[#ffb4ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <span className="absolute bottom-1 left-1 text-[8px] font-semibold text-[#a1a1aa] bg-[#09090b]/80 px-1 leading-none">
                            Saved
                          </span>
                        </div>
                      ))}

                      {newImages.map((img, idx) => (
                        <div key={`new-${idx}`} className="relative aspect-square border border-[#d4af37]/60 bg-[#0c0c0f] overflow-hidden group">
                          <img src={img.preview} alt={`New frame ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute inset-0 bg-[#09090b]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            aria-label={`Remove new frame ${idx + 1}`}
                          >
                            <svg className="w-4 h-4 text-[#ffb4ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <span className="absolute bottom-1 left-1 text-[8px] font-semibold text-[#f2ca50] bg-[#09090b]/80 px-1 leading-none">
                            New
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Archival Variants Section */}
                  <div className="space-y-4 pt-6 border-t border-[#1e1e24]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xs font-semibold tracking-[0.25em] text-[#d4af37] uppercase">
                          Product Variants & Editions (Optional)
                        </h2>
                        <p className="text-[11px] text-[#71717a] font-light mt-0.5">
                          Configure multiple variants with custom attributes (size, color, material), dedicated pricing, stock, and photography.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="px-3.5 py-2 border border-[#d4af37]/60 hover:bg-[#d4af37]/10 text-[#f2ca50] text-[10px] font-semibold tracking-[0.2em] uppercase transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Variant
                      </button>
                    </div>

                    {variants.length === 0 ? (
                      <div className="p-4 border border-[#1e1e24] bg-[#0d0d11] text-center text-[#71717a] text-xs font-light">
                        No variants registered for this creation. Click &ldquo;Add Variant&rdquo; to introduce additional editions or sizes.
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {variants.map((v, vIdx) => (
                          <div key={v.id || vIdx} className="p-4 sm:p-5 border border-[#23232a] bg-[#0c0c10] space-y-4 relative">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1b1b22]">
                              <span className="text-[10px] font-bold tracking-[0.2em] text-[#f2ca50] uppercase">
                                Variant Edition #{String(vIdx + 1).padStart(2, "0")}
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => duplicateVariant(vIdx)}
                                  className="text-[10px] tracking-wider text-[#d4af37] hover:underline uppercase cursor-pointer"
                                >
                                  + Duplicate
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeVariant(vIdx)}
                                  className="text-[10px] tracking-wider text-[#ffb4ab] hover:underline uppercase cursor-pointer"
                                >
                                  Remove Variant
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[9px] font-medium tracking-[0.2em] text-[#a1a1aa] uppercase mb-1.5">
                                  Variant Price
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={v.priceAmount}
                                  onChange={(e) => updateVariantField(vIdx, "priceAmount", e.target.value)}
                                  placeholder={formData.priceAmount || "0.00"}
                                  className="w-full bg-[#121216] border border-[#27272a] focus:border-[#d4af37] px-3 py-2 text-xs text-[#f4f4f5] outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-medium tracking-[0.2em] text-[#a1a1aa] uppercase mb-1.5">
                                  Currency
                                </label>
                                <select
                                  value={v.priceCurrency}
                                  onChange={(e) => updateVariantField(vIdx, "priceCurrency", e.target.value)}
                                  className="w-full bg-[#121216] border border-[#27272a] focus:border-[#d4af37] px-3 py-2 text-xs text-[#f4f4f5] outline-none cursor-pointer"
                                >
                                  {CURRENCIES.map((c) => (
                                    <option key={c} value={c} className="bg-[#121216] text-[#e5e1e4]">
                                      {c}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-medium tracking-[0.2em] text-[#a1a1aa] uppercase mb-1.5">
                                  Stock Count
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={v.stock}
                                  onChange={(e) => updateVariantField(vIdx, "stock", e.target.value)}
                                  placeholder="0"
                                  className="w-full bg-[#121216] border border-[#27272a] focus:border-[#d4af37] px-3 py-2 text-xs text-[#f4f4f5] outline-none"
                                />
                              </div>
                            </div>

                            {/* Attributes */}
                            <div className="space-y-2 pt-2 border-t border-[#1b1b22]">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
                                  Specifications & Attributes (e.g. Size, Color)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addVariantAttribute(vIdx)}
                                  className="text-[9px] tracking-wider text-[#d4af37] hover:underline uppercase cursor-pointer"
                                >
                                  + Add Attribute
                                </button>
                              </div>

                              <div className="space-y-2">
                                {v.attributes.map((attr, aIdx) => (
                                  <div key={aIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={attr.key}
                                      onChange={(e) => updateVariantAttribute(vIdx, aIdx, "key", e.target.value)}
                                      placeholder="Attribute (e.g. Size)"
                                      className="w-1/3 bg-[#121216] border border-[#27272a] focus:border-[#d4af37] px-3 py-1.5 text-xs text-[#f4f4f5] outline-none"
                                    />
                                    <input
                                      type="text"
                                      value={attr.value}
                                      onChange={(e) => updateVariantAttribute(vIdx, aIdx, "value", e.target.value)}
                                      placeholder="Value (e.g. Medium / Noir)"
                                      className="grow bg-[#121216] border border-[#27272a] focus:border-[#d4af37] px-3 py-1.5 text-xs text-[#f4f4f5] outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeVariantAttribute(vIdx, aIdx)}
                                      className="p-1.5 text-[#71717a] hover:text-[#ffb4ab] cursor-pointer text-xs"
                                      title="Remove Attribute"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Variant Images */}
                            <div className="space-y-2 pt-2 border-t border-[#1b1b22]">
                              <span className="text-[9px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase block">
                                Variant Photographic Frames
                              </span>
                              <div className="flex flex-wrap items-center gap-2">
                                {v.existingImages?.map((url, imgIdx) => (
                                  <div key={imgIdx} className="relative w-14 h-14 border border-[#27272a] bg-[#121216] overflow-hidden group">
                                    <img src={url} alt={`Saved variant frame ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeVariantExistingImage(vIdx, imgIdx)}
                                      className="absolute inset-0 bg-[#09090b]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#ffb4ab] text-xs cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                {v.newImages?.map((img, imgIdx) => (
                                  <div key={imgIdx} className="relative w-14 h-14 border border-[#d4af37]/60 bg-[#121216] overflow-hidden group">
                                    <img src={img.preview} alt={`New variant frame ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeVariantNewImage(vIdx, imgIdx)}
                                      className="absolute inset-0 bg-[#09090b]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#ffb4ab] text-xs cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <label className="w-14 h-14 border border-dashed border-[#2e2e38] hover:border-[#d4af37] flex flex-col items-center justify-center cursor-pointer text-[#71717a] hover:text-[#f2ca50] transition-colors">
                                  <span className="text-base leading-none">+</span>
                                  <span className="text-[8px] uppercase tracking-wider mt-0.5">Frame</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleVariantFiles(vIdx, e.target.files)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Actions */}
                  <div className="pt-4 border-t border-[#1e1e24] flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="grow py-4 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[#f2ca50] hover:shadow-[0_0_30px_rgba(242,202,80,0.35)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "UPDATING ATELIER RECORD..." : "SAVE MODIFICATIONS"}
                    </button>
                    <Link
                      to="/dashboard"
                      className="py-4 px-6 border border-[#27272a] hover:border-[#d4af37] text-[#a1a1aa] hover:text-[#f4f4f5] text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}