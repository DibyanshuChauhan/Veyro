import {
    findCartByUserId,
    createCart,
    saveCart,
    clearCartByUserId
} from "../dao/cart.dao.js";
import {
    findProductById,
    findProductWithVariant
} from "../dao/product.dao.js";

// 1. ADD TO CART
// Adds a product (and optional variant) to the user's cart.
// If the piece is already in cart, increments its quantity.
export const addToCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const quantity = Number(req.body.quantity) || 1;

        // Step 1: Find the product (using Product DAO)
        const product = variantId
            ? await findProductWithVariant(productId, variantId)
            : await findProductById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product or variant not found"
            });
        }

        // Step 2: Determine price and available stock entered by the user/seller
        let itemPrice = product.price;
        let availableStock = 0;

        if (variantId) {
            // Read stock entered for this specific variant edition
            const variant = product.variants.id(variantId);
            if (variant) {
                if (variant.price?.amount) itemPrice = variant.price;
                availableStock = Number(variant.stock) || 0;
            }
        } else {
            // Read stock entered for the base piece
            availableStock = Number(product.stock) || 0;
        }

        // Check if piece is in stock
        if (availableStock <= 0) {
            return res.status(400).json({
                success: false,
                message: "This item is currently out of stock"
            });
        }

        // Step 3: Find existing user cart or create a new one (using Cart DAO)
        let cart = await findCartByUserId(req.user._id, false);
        if (!cart) {
            cart = await createCart(req.user._id);
        }

        // Step 4: Check if this product & variant is already in the cart
        const existingItem = cart.items.find((item) => {
            const isSameProduct = item.product.toString() === productId;
            const isSameVariant = variantId
                ? item.variant?.toString() === variantId
                : !item.variant;
            return isSameProduct && isSameVariant;
        });

        if (existingItem) {
            // Check if combined quantity exceeds seller's stock
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > availableStock) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add more. You have ${existingItem.quantity} in cart and only ${availableStock} in stock.`
                });
            }
            existingItem.quantity = newQuantity;
            existingItem.price = itemPrice;
        } else {
            // Check if requested quantity exceeds seller's stock
            if (quantity > availableStock) {
                return res.status(400).json({
                    success: false,
                    message: `Requested quantity (${quantity}) exceeds available stock (${availableStock})`
                });
            }

            cart.items.push({
                product: productId,
                variant: variantId || null,
                quantity,
                price: itemPrice
            });
        }

        // Step 5: Save cart and populate product details (using Cart DAO)
        await saveCart(cart, true);

        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error adding item to cart",
            error: error.message
        });
    }
};

// 2. GET CART
// Retrieves the user's cart with populated product details and total price.
export const getCart = async (req, res) => {
    try {
        // Find cart for the logged-in user and populate product info (using Cart DAO)
        const cart = await findCartByUserId(req.user._id, true);

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                cart: { items: [] },
                totalAmount: 0
            });
        }

        // Calculate total amount across all items
        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + (item.price?.amount || 0) * item.quantity;
        }, 0);

        return res.status(200).json({
            success: true,
            message: "Cart retrieved successfully",
            cart,
            totalAmount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving cart",
            error: error.message
        });
    }
};

// 3. UPDATE CART ITEM QUANTITY
// Updates quantity for a specific item, or removes it if quantity <= 0.
export const updateCartItemQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const quantity = Number(req.body.quantity);

        const cart = await findCartByUserId(req.user._id, true);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Find the item inside cart.items by its subdocument ID
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        // If quantity is 0 or less, remove item using Mongoose .pull()
        if (quantity <= 0) {
            cart.items.pull(itemId);
        } else {
            // Check user/seller entered stock
            const product = item.product;
            let availableStock = 0;
            if (item.variant && product?.variants) {
                const variant = product.variants.id(item.variant);
                if (variant) availableStock = Number(variant.stock) || 0;
            } else if (product) {
                availableStock = Number(product.stock) || 0;
            }

            if (product && quantity > availableStock) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot update quantity to ${quantity}. Only ${availableStock} in stock.`
                });
            }

            item.quantity = quantity;
        }

        // Save changes using Cart DAO
        await saveCart(cart, true);

        return res.status(200).json({
            success: true,
            message: quantity <= 0 ? "Item removed from cart" : "Cart item quantity updated",
            cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating cart item",
            error: error.message
        });
    }
};

// 4. REMOVE ITEM FROM CART
// Removes a single item from the cart by its cart item ID.
export const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await findCartByUserId(req.user._id, true);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Remove item from items array
        cart.items.pull(itemId);

        // Save changes using Cart DAO
        await saveCart(cart, true);

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error removing item from cart",
            error: error.message
        });
    }
};

// 5. CLEAR CART
// Empties all items from the user's cart.
export const clearCart = async (req, res) => {
    try {
        // Clear cart using Cart DAO
        await clearCartByUserId(req.user._id);

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart: { items: [] },
            totalAmount: 0
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error clearing cart",
            error: error.message
        });
    }
};
