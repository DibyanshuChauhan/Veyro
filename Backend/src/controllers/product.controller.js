import mongoose from "mongoose";
import * as productDAO from "../dao/product.dao.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    try {
        const allFiles = req.files ?? [];
        const mainImageFiles = allFiles.filter(f => f.fieldname === "images");

        const images = await Promise.all(mainImageFiles.map(async (file) => {
            const uploaded = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname,
                folder: "veyro"
            });
            return { url: uploaded.url };
        }));

        let parsedVariants = [];
        if (req.body.variants) {
            try {
                parsedVariants = typeof req.body.variants === "string"
                    ? JSON.parse(req.body.variants)
                    : req.body.variants;
            } catch (e) {
                parsedVariants = [];
            }
        }

        const processedVariants = [];
        if (Array.isArray(parsedVariants)) {
            for (let i = 0; i < parsedVariants.length; i++) {
                const v = parsedVariants[i];
                if (!v) continue;

                const variantFiles = allFiles.filter(f => f.fieldname === `variant_${i}_images`);
                const uploadedVariantImages = await Promise.all(variantFiles.map(async (file) => {
                    const uploaded = await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname,
                        folder: "veyro"
                    });
                    return { url: uploaded.url };
                }));

                const existingVariantImages = (v.images || []).map(img => 
                    typeof img === "string" ? { url: img } : (img?.url ? { url: img.url } : null)
                ).filter(Boolean);

                const finalVariantImages = [...uploadedVariantImages, ...existingVariantImages];
                if (finalVariantImages.length === 0 && images.length > 0) {
                    finalVariantImages.push({ url: images[0].url });
                }

                let attributesObj = {};
                if (v.attributes) {
                    if (Array.isArray(v.attributes)) {
                        v.attributes.forEach(attr => {
                            if (attr?.key && attr.key.trim()) {
                                attributesObj[attr.key.trim()] = String(attr.value || "").trim();
                            }
                        });
                    } else if (typeof v.attributes === "object") {
                        for (const [k, val] of Object.entries(v.attributes)) {
                            if (k && k.trim()) {
                                attributesObj[k.trim()] = String(val || "").trim();
                            }
                        }
                    }
                }

                const vAmount = Number(v.price?.amount ?? v.priceAmount ?? priceAmount);
                const vCurrency = v.price?.currency || v.priceCurrency || priceCurrency || "INR";

                processedVariants.push({
                    images: finalVariantImages,
                    stock: Number(v.stock) >= 0 ? Number(v.stock) : 0,
                    attributes: attributesObj,
                    price: {
                        amount: isNaN(vAmount) ? Number(priceAmount) : vAmount,
                        currency: vCurrency
                    }
                });
            }
        }

        const product = await productDAO.createProduct({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            stock: Number(req.body.stock) >= 0 ? Number(req.body.stock) : 0,
            images,
            variants: processedVariants,
            seller: seller._id
        });

        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating product",
            success: false,
            error: error.message
        });
    }
};

export const getProductsBySeller = async (req, res) => {
const seller = req.user;

    try {
        const products = await productDAO.findProductsBySeller(seller._id);
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            success: false,
            error: error.message
        }) 
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await productDAO.findAllProducts();
        res.status(200).json({
            message: "All archival products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching catalog products",
            success: false,
            error: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Archival product not found",
            success: false
        });
    }

    try {
        const product = await productDAO.findProductById(id, true);
        if (!product) {
            return res.status(404).json({
                message: "Archival product not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching product details",
            success: false,
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Archival product not found",
            success: false
        });
    }

    try {
        const product = await productDAO.findProductById(id);
        if (!product) {
            return res.status(404).json({
                message: "Archival product not found",
                success: false
            });
        }

        if (product.seller.toString() !== seller._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized: You can only edit your own creations",
                success: false
            });
        }

        const allFiles = req.files ?? [];
        const mainImageFiles = allFiles.filter(f => f.fieldname === "images");
        let newImages = [];
        if (mainImageFiles.length > 0) {
            newImages = await Promise.all(mainImageFiles.map(async (file) => {
                const uploaded = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                    folder: "veyro"
                });
                return { url: uploaded.url };
            }));
        }

        if (title) product.title = title;
        if (description) product.description = description;
        if (req.body.stock !== undefined) {
            product.stock = Number(req.body.stock) >= 0 ? Number(req.body.stock) : 0;
        }
        if (priceAmount) {
            product.price = {
                amount: priceAmount,
                currency: priceCurrency || product.price?.currency || "INR"
            };
        } else if (priceCurrency && product.price) {
            product.price.currency = priceCurrency;
        }

        if (newImages.length > 0) {
            product.images = newImages;
        }

        if (req.body.variants !== undefined) {
            let parsedVariants = [];
            try {
                parsedVariants = typeof req.body.variants === "string"
                    ? JSON.parse(req.body.variants)
                    : req.body.variants;
            } catch (e) {
                parsedVariants = [];
            }

            const processedVariants = [];
            if (Array.isArray(parsedVariants)) {
                for (let i = 0; i < parsedVariants.length; i++) {
                    const v = parsedVariants[i];
                    if (!v) continue;

                    const variantFiles = allFiles.filter(f => f.fieldname === `variant_${i}_images`);
                    const uploadedVariantImages = await Promise.all(variantFiles.map(async (file) => {
                        const uploaded = await uploadFile({
                            buffer: file.buffer,
                            fileName: file.originalname,
                            folder: "veyro"
                        });
                        return { url: uploaded.url };
                    }));

                    const existingVariantImages = (v.images || []).map(img => 
                        typeof img === "string" ? { url: img } : (img?.url ? { url: img.url } : null)
                    ).filter(Boolean);

                    const finalVariantImages = [...uploadedVariantImages, ...existingVariantImages];
                    if (finalVariantImages.length === 0 && product.images.length > 0) {
                        finalVariantImages.push({ url: product.images[0].url });
                    }

                    let attributesObj = {};
                    if (v.attributes) {
                        if (Array.isArray(v.attributes)) {
                            v.attributes.forEach(attr => {
                                if (attr?.key && attr.key.trim()) {
                                    attributesObj[attr.key.trim()] = String(attr.value || "").trim();
                                }
                            });
                        } else if (typeof v.attributes === "object") {
                            for (const [k, val] of Object.entries(v.attributes)) {
                                if (k && k.trim()) {
                                    attributesObj[k.trim()] = String(val || "").trim();
                                }
                            }
                        }
                    }

                    const vAmount = Number(v.price?.amount ?? v.priceAmount ?? product.price.amount);
                    const vCurrency = v.price?.currency || v.priceCurrency || product.price.currency || "INR";

                    processedVariants.push({
                        images: finalVariantImages,
                        stock: Number(v.stock) >= 0 ? Number(v.stock) : 0,
                        attributes: attributesObj,
                        price: {
                            amount: isNaN(vAmount) ? Number(product.price.amount) : vAmount,
                            currency: vCurrency
                        }
                    });
                }
            }
            product.variants = processedVariants;
        }

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating product",
            success: false,
            error: error.message
        });
    }
};