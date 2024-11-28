import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth-types';


const token = localStorage.getItem('token')
const isResponderString = localStorage.getItem('isResponder')
const responderType = localStorage.getItem('responderType')
const userString = localStorage.getItem('user')
const user = userString ? JSON.parse(userString) : null;
const isResponder = isResponderString ? JSON.parse(isResponderString) : null;
// initial state 
const initialState: AuthState = {
  user: user || null,
  token:  token || null,
  loading: false,
  isResponder: isResponder || false,
  responderType: responderType || null,
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
      state.isResponder = false;
      state.responderType = null;
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