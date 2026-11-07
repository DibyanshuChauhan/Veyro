import { setError, setLoading, setUser, logout } from "../state/auth.slice";
import { loginuser, registerUser } from "../service/auth.api";
import { useDispatch, useSelector } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

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
            return resolvedUser;
        } catch(err) {
            const msg = err?.response?.data?.error || err.message || "Registration failed";
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
            return resolvedUser;
        } catch(err) {
            const msg = err?.response?.data?.error || err.message || "Login failed";
            dispatch(setError(msg));
            throw err;
        } finally {
            dispatch(setLoading(false));
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
        handleRegister,
        handleLogin,
        handleLogout
    };
};
