import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProduct: [],
        catalogProducts: [],
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProduct = action.payload?.products || action.payload || [];
        },
        setCatalogProducts: (state, action) => {
            state.catalogProducts = action.payload?.products || action.payload || [];
        }
    }
});

export const { setSellerProducts, setCatalogProducts } = productSlice.actions;
export default productSlice.reducer;
