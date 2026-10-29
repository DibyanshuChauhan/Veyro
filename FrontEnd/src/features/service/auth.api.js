import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/auth",
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