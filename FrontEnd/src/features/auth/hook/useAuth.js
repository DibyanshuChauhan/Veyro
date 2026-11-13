import { setError, setLoading, setUser, setSessionValidated, logout } from "../state/auth.slice";
import { loginuser, registerUser, getCurrentUser } from "../service/auth.api";
import { useDispatch, useSelector } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error, sessionValidated } = useSelector((state) => state.auth);

    const isSeller = Boolean(user && (user.role === "seller" || user.isSeller === true));

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await registerUser({ email, contact, password, fullname, isSeller });
            const rawUser = data?.user || data;
            const resolvedUser = {
                ...rawUser,
                isSeller: rawUser.role === "seller" || Boolean(isSeller)
            };
            dispatch(setUser(resolvedUser));
            dispatch(setSessionValidated(true));
            return resolvedUser;
        } catch (err) {
            const cause = err?.cause || err;
            const msg = cause?.response?.data?.error || cause?.response?.data?.message || err.message || "Registration failed";
            dispatch(setError(msg));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await loginuser({ email, password });
            const rawUser = data?.user || data;
            const resolvedUser = {
                ...rawUser,
                isSeller: rawUser.role === "seller" || Boolean(rawUser.isSeller)
            };
            dispatch(setUser(resolvedUser));
            dispatch(setSessionValidated(true));
            return resolvedUser;
        } catch (err) {
            const cause = err?.cause || err;
            const msg = cause?.response?.data?.error || cause?.response?.data?.message || err.message || "Login failed";
            dispatch(setError(msg));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    /**
     * Called once on app boot — validates the HTTP-only cookie against the server.
     * If the cookie is missing or expired, the server returns 401 → we dispatch logout()
     * which zeroes out user state. If valid, we hydrate the Redux store from the server.
     * Either way, sessionValidated is set to true so ProtectedRoute stops blocking.
     */
    async function validateSession() {
        try {
            dispatch(setLoading(true));
            const data = await getCurrentUser();
            const rawUser = data?.user || data;
            const resolvedUser = {
                ...rawUser,
                isSeller: rawUser.role === "seller" || Boolean(rawUser.isSeller)
            };
            dispatch(setUser(resolvedUser));
        } catch {
            // Cookie absent, expired, or invalid — clear everything
            dispatch(logout());
        } finally {
            dispatch(setLoading(false));
            dispatch(setSessionValidated(true));
        }
    }

    function handleLogout() {
        dispatch(logout());
    }

    return {
        user,
        loading,
        error,
        isSeller,
        sessionValidated,
        handleRegister,
        handleLogin,
        handleLogout,
        validateSession,
    };
};
