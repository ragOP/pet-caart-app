import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null, 
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;  
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;  
      state.isLoggedIn = false;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
