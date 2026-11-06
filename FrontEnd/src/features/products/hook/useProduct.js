import { setSellerProducts } from "../state/product.slice";
import { createProducts, getProductsBySeller } from "../services/product.api";
import { useDispatch } from "react-redux";

export const useProduct = () => {
    const dispatch = useDispatch();
    const handleAddProducts = async (formData) => {
        try {
            const result = await createProducts(formData);
            return result.product;
        } catch (err) {
            throw err;
        }
    }
    const handlegetSellerProducts = async () => {
        try {
            const result = await getProductsBySeller();
            dispatch(setSellerProducts(result));
            return result.product;
        } catch (err) {
            throw err;
        }
    }
    return { handleAddProducts, handlegetSellerProducts };

}