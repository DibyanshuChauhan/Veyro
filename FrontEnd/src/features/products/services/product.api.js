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
        throw error;
    }
}

export const getProductsBySeller = async () => {
    try {
        const response = await api.get("/seller");
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getAllProducts = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getProductById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
