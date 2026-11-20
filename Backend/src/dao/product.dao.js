import productModel from "../models/product.model.js";

/**
 * Product Data Access Object (DAO)
 * Centralizes all MongoDB database interactions for the Product model.
 */

// Create and save a new product piece
export const createProduct = async (productData) => {
    return await productModel.create(productData);
};

// Find a single product by its ID, with optional seller population
export const findProductById = async (productId, populateSeller = false) => {
    const query = productModel.findById(productId);
    if (populateSeller) {
        query.populate("seller", "fullname email contact");
    }
    return await query;
};

// Find a product verifying that it contains a specific variant ID
export const findProductWithVariant = async (productId, variantId) => {
    return await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });
};

// Find all products created by a specific seller
export const findProductsBySeller = async (sellerId) => {
    return await productModel.find({ seller: sellerId });
};

// Retrieve all archival products sorted by newest first with seller details
export const findAllProducts = async () => {
    return await productModel
        .find({})
        .populate("seller", "fullname email contact")
        .sort({ createdAt: -1 });
};

// Update a product by its ID
export const updateProductById = async (productId, updateData) => {
    return await productModel.findByIdAndUpdate(productId, updateData, { new: true });
};

// Delete a product by its ID
export const deleteProductById = async (productId) => {
    return await productModel.findByIdAndDelete(productId);
};
