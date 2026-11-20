import cartModel from "../models/cart.model.js";

/**
 * Cart Data Access Object (DAO)
 * Centralizes all MongoDB database interactions for the Cart model.
 */

// Find a user's cart, optionally populating the product reference
export const findCartByUserId = async (userId, populateProduct = true) => {
    const query = cartModel.findOne({ user: userId });
    if (populateProduct) {
        query.populate("items.product");
    }
    return await query;
};

// Create a new cart document for a user
export const createCart = async (userId, items = []) => {
    return await cartModel.create({ user: userId, items });
};

// Save changes to an existing cart document, optionally populating product details
export const saveCart = async (cart, populateProduct = true) => {
    await cart.save();
    if (populateProduct) {
        await cart.populate("items.product");
    }
    return cart;
};

// Clear all items from a user's cart
export const clearCartByUserId = async (userId) => {
    return await cartModel.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } },
        { new: true }
    );
};
