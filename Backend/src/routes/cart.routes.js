import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
    validateAddToCart,
    validateUpdateCartItem,
    validateRemoveCartItem
} from "../validator/cart.validator.js";
import {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

// Require authentication for all cart operations
cartRouter.use(authenticateUser);

// GET /api/cart - Fetch current user's cart
cartRouter.get("/", getCart);

// POST /api/cart/add/:productId/:variantId? - Add item to cart
cartRouter.post("/add/:productId/:variantId", validateAddToCart, addToCart);
cartRouter.post("/add/:productId", validateAddToCart, addToCart);

// PATCH / PUT /api/cart/item/:itemId - Update item quantity (0 removes item)
cartRouter.patch("/item/:itemId", validateUpdateCartItem, updateCartItemQuantity);
cartRouter.put("/item/:itemId", validateUpdateCartItem, updateCartItemQuantity);

// DELETE /api/cart/item/:itemId - Remove specific item from cart
cartRouter.delete("/item/:itemId", validateRemoveCartItem, removeCartItem);

// DELETE /api/cart/clear - Clear all items from cart
cartRouter.delete("/clear", clearCart);

export default cartRouter;
