import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false,
    error: null,
    toast: null // { title, subtitle, imageUrl, price, currency }
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartLoading: (state, action) => {
            state.loading = Boolean(action.payload);
            if (state.loading) state.error = null;
        },
        setCartError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setCartData: (state, action) => {
            const payload = action.payload || {};
            const items = Array.isArray(payload.items)
                ? payload.items
                : Array.isArray(payload)
                    ? payload
                    : [];

            state.items = items;
            state.totalAmount = items.reduce(
                (sum, item) => sum + (Number(item.price?.amount) || 0) * (Number(item.quantity) || 1),
                0
            );
            state.totalItems = items.reduce(
                (sum, item) => sum + (Number(item.quantity) || 1),
                0
            );
            state.loading = false;
            state.error = null;
        },
        showToast: (state, action) => {
            state.toast = action.payload;
        },
        hideToast: (state) => {
            state.toast = null;
        },
        resetCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalItems = 0;
            state.loading = false;
            state.error = null;
            state.toast = null;
        }
    }
});

export const {
    setCartLoading,
    setCartError,
    setCartData,
    showToast,
    hideToast,
    resetCart
} = cartSlice.actions;

export default cartSlice.reducer;
