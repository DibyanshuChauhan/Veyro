import axios from "axios";

const api = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
});

/**
 * Fetch the authenticated user's cart
 */
export const fetchCartApi = async () => {
    const response = await api.get("/");
    return response.data;
};

/**
 * Add a product (with optional variant and quantity) to the cart
 */
export const addToCartApi = async ({ productId, variantId, quantity = 1 }) => {
    const url = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`;
    const response = await api.post(url, { quantity });
    return response.data;
};

/**
 * Update the quantity of a specific item in the cart
 * Passing quantity 0 removes the item
 */
export const updateCartQuantityApi = async (itemId, quantity) => {
    const response = await api.patch(`/item/${itemId}`, { quantity });
    return response.data;
};

/**
 * Remove an item from the cart by its cart item ID
 */
export const removeCartItemApi = async (itemId) => {
    const response = await api.delete(`/item/${itemId}`);
    return response.data;
};

/**
 * Clear all items from the cart
 */
export const clearCartApi = async () => {
    const response = await api.delete("/clear");
    return response.data;
};
