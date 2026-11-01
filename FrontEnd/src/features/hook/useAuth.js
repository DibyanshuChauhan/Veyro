import { setError, setLoading, setUser } from "../auth/state/auth.slice";
import { loginuser, registerUser } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
        try {
            const data = await registerUser({ email, contact, password, fullname, isSeller });
            dispatch(setUser(data));
        } catch(error) {
            dispatch(setError(error.message));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            const data = await loginuser({ email, password});
            dispatch(setUser(data));
        }
        catch(error) {
            dispatch(setError(error.message));
        }
    }

    return {
        handleRegister,
        handleLogin
    }
}