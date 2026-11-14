import { setSellerProducts, setCatalogProducts } from "../state/product.slice";
import { createProducts, getProductsBySeller, getAllProducts } from "../services/product.api";
import { useDispatch } from "react-redux";
import { useState } from "react";

export const useProduct = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddProducts = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await createProducts(formData);
            return result.product;
        } catch (err) {
            setError(err?.response?.data?.error || err.message || "Failed to create product");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handlegetSellerProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getProductsBySeller();
            const products = result?.products || result || [];
            dispatch(setSellerProducts(products));
            return products;
        } catch (err) {
            setError(err?.response?.data?.error || err.message || "Failed to fetch seller products");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllProducts();
            const products = result?.products || result || [];
            dispatch(setCatalogProducts(products));
            return products;
        } catch (err) {
            setError(err?.response?.data?.error || err.message || "Failed to fetch archival catalog");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleAddProducts,
        handlegetSellerProducts,
        handleGetAllProducts,
        loading,
        error
    };
};
