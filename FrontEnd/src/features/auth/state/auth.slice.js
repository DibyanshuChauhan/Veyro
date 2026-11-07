import { createSlice } from "@reduxjs/toolkit";

const initialUser = (() => {
  try {
    const saved = localStorage.getItem("veyro_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
})();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
      if (action.payload) {
        try {
          localStorage.setItem("veyro_user", JSON.stringify(action.payload));
        } catch {
          // ignore storage errors
        }
      } else {
        localStorage.removeItem("veyro_user");
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("veyro_user");
    }
  }
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
