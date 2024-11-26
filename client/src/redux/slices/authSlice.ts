import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// auth state 
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// user type - maybe move to types file??
interface User {
  id: string;
  username: string;
  email: string;
}

// initial state 
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
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
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
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