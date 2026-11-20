import axios from "axios";

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export const registerUser = async ({ email, contact, password, fullname, isSeller }) => {
    const response = await api.post("/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    });
    return response.data;
}

export const loginuser = async ({ email, password }) => {
    const response = await api.post("/login", {
        email,
        password
    });
    return response.data;
}

/**
 * Validates the current HTTP-only cookie session against the server.
 * Returns the user object if the cookie is valid; throws (401) if not.
 */
export const getCurrentUser = async () => {
    const response = await api.get("/me");
    return response.data;
}

/**
 * Log out user by clearing the HTTP-only authentication cookie on the backend.
 */
export const logoutUserApi = async () => {
    const response = await api.post("/logout");
    return response.data;
}