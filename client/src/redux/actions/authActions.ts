import { AppDispatch } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../slices/authSlice';
import axios from 'axios';

// Login action
export const login = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    const { user, token } = response.data;
    dispatch(loginSuccess({ user, token }));
    localStorage.setItem('token', token);
  } catch (error: unknown) {
    let errorMessage = 'Login failed';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }
    dispatch(loginFailure(errorMessage));
  }
};

// Logout action
export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('token');
  dispatch(logout());
};