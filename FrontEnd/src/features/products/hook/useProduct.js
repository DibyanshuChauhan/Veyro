import { setSellerProducts, setCatalogProducts, setCurrentProduct } from "../state/product.slice";
import { createProducts, getProductsBySeller, getAllProducts, getProductById } from "../services/product.api";
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

    const handleGetProductById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getProductById(id);
            const product = result?.product || result;
            dispatch(setCurrentProduct(product));
            return product;
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data?.error || err.message || "Failed to fetch product details");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleAddProducts,
        handlegetSellerProducts,
        handleGetAllProducts,
        handleGetProductById,
        loading,
        error
    };
};
