import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth-types';

// initial state 
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  isResponder: false,
  error: null,
};

// slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string; isResponder: boolean; }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isResponder = action.payload.isResponder;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
    registrationFailure(state, action: PayloadAction<string>) { 
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// export actions
export const { loginStart, loginSuccess, loginFailure, logout, registrationFailure } = authSlice.actions;

// export reducer
export default authSlice.reducer;