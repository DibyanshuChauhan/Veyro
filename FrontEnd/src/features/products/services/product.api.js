import axios from "axios";

const api = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export const createProducts = async (formData) => {
    try {
        const response = await api.post("/", formData)
        return response.data;
    }
    catch (error) {
        throw new Error("Can't create the product", {
            cause: error
        })
    }
}

export const getProductsBySeller = async () => {
    try {
        const response = await api.get("/seller");
        return response.data;
    }
    catch (error) {
        throw new Error("Can't view the listed products", {
            cause: error
        })
    }
}