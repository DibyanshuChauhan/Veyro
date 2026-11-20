import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
    setCartLoading,
    setCartError,
    setCartData,
    showToast,
    hideToast,
    resetCart
} from "../state/cart.slice.js";
import {
    fetchCartApi,
    addToCartApi,
    updateCartQuantityApi,
    removeCartItemApi,
    clearCartApi
} from "../service/cart.api.js";

/**
 * Custom Hook for Cart Operations
 * Encapsulates state selectors, dispatch actions, and API communication.
 */
export const useCart = () => {
    const dispatch = useDispatch();
    const cartState = useSelector((state) => state.cart);

    // Fetch the current user's cart from the backend
    const handleGetCart = useCallback(async () => {
        dispatch(setCartLoading(true));
        try {
            const data = await fetchCartApi();
            if (data?.cart) {
                dispatch(setCartData(data.cart));
            }
            return data?.cart;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            dispatch(setCartError(msg));
            return null;
        }
    }, [dispatch]);

    // Add an archival product or edition variant to the cart (triggers Toast, NO popup)
    const handleAddToCart = useCallback(
        async ({ productId, variantId, quantity = 1, toastMeta = null }) => {
            dispatch(setCartLoading(true));
            try {
                const data = await addToCartApi({ productId, variantId, quantity });
                if (data?.cart) {
                    dispatch(setCartData(data.cart));
                    // Trigger luxurious toast notification
                    dispatch(
                        showToast({
                            title: toastMeta?.title || "Archival Garment Added",
                            edition: toastMeta?.edition || null,
                            imageUrl: toastMeta?.imageUrl || null,
                            price: toastMeta?.price || null,
                            currency: toastMeta?.currency || "INR",
                            quantity
                        })
                    );
                }
                return { success: true, cart: data?.cart, message: data?.message };
            } catch (err) {
                const msg = err.response?.data?.message || err.message;
                dispatch(setCartError(msg));
                return { success: false, error: msg };
            }
        },
        [dispatch]
    );

    // Dismiss the active cart toast notification
    const handleDismissToast = useCallback(() => {
        dispatch(hideToast());
    }, [dispatch]);

    // Update quantity of an item in the cart (0 removes the item)
    const handleUpdateQuantity = useCallback(
        async (itemId, quantity) => {
            dispatch(setCartLoading(true));
            try {
                const data = await updateCartQuantityApi(itemId, quantity);
                if (data?.cart) {
                    dispatch(setCartData(data.cart));
                }
                return { success: true, cart: data?.cart };
            } catch (err) {
                const msg = err.response?.data?.message || err.message;
                dispatch(setCartError(msg));
                return { success: false, error: msg };
            }
        },
        [dispatch]
    );

    // Remove a single item from the cart
    const handleRemoveFromCart = useCallback(
        async (itemId) => {
            dispatch(setCartLoading(true));
            try {
                const data = await removeCartItemApi(itemId);
                if (data?.cart) {
                    dispatch(setCartData(data.cart));
                }
                return { success: true, cart: data?.cart };
            } catch (err) {
                const msg = err.response?.data?.message || err.message;
                dispatch(setCartError(msg));
                return { success: false, error: msg };
            }
        },
        [dispatch]
    );

    // Clear all items from the cart
    const handleClearCart = useCallback(async () => {
        dispatch(setCartLoading(true));
        try {
            await clearCartApi();
            dispatch(resetCart());
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            dispatch(setCartError(msg));
            return { success: false, error: msg };
        }
    }, [dispatch]);

    return {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        totalItems: cartState.totalItems,
        loading: cartState.loading,
        error: cartState.error,
        toast: cartState.toast,
        handleDismissToast,
        handleGetCart,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveFromCart,
        handleClearCart
    };
};
