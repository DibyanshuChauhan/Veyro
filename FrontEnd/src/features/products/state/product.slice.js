import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProduct: [],
        catalogProducts: [],
        currentProduct: null,
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProduct = action.payload?.products || action.payload || [];
        },
        setCatalogProducts: (state, action) => {
            state.catalogProducts = action.payload?.products || action.payload || [];
        },
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload?.product || action.payload || null;
        }
    }
});

export const { setSellerProducts, setCatalogProducts, setCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
