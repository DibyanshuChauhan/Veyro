import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    error: null,
    sessionValidated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSessionValidated: (state, action) => {
      state.sessionValidated = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.sessionValidated = true;
    }
  }
});

export const { setUser, setLoading, setError, setSessionValidated, logout } = authSlice.actions;
export default authSlice.reducer;
