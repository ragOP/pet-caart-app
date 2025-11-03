// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  returnRoute: null,
  returnParams: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: state => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.returnRoute = null;
      state.returnParams = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    logout: state => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.returnRoute = null;
      state.returnParams = null;
    },
    setUser: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
    },
    setReturnRoute: (state, action) => {
      state.returnRoute = action.payload.routeName;
      state.returnParams = action.payload.params;
    },
    clearReturnRoute: state => {
      state.returnRoute = null;
      state.returnParams = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  setReturnRoute,
  clearReturnRoute,
} = authSlice.actions;
export default authSlice.reducer;
