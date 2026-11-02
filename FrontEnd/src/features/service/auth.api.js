import axios from "axios";

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export const registerUser = async ({ email, contact, password, fullname, isSeller }) => {
    try {
        const response = await api.post("/register", {
            email,
            contact,
            password,
            fullname,
            isSeller
        });
        return response.data;
    } catch (error) {
        throw new Error("Registration failed", {
            cause: error 
        });
    }
}

export const loginuser = async ({ email, password }) => {
    try {
        const response = await api.post("/login", {
            email,
            password
        });
        return response.data;
    }
    catch (error) {
        throw new Error("Login failed", {
            cause: error
        })
    }
}