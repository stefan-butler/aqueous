import { AppDispatch } from '../store';
import { loginStart, loginSuccess, loginFailure, logout, registrationFailure } from '../slices/authSlice';
import { LoginResponse, User } from '../../types/auth-types';
import axios from 'axios';

const baseUrl = 'http://localhost:3000';

// Login action
export const login = (email: string, password: string) => async (dispatch: AppDispatch): Promise<void> => {
  dispatch(loginStart());
  try {
    const response = await axios.post<LoginResponse>(`${baseUrl}/auth/login`, { email, password });
    console.log(response.data);

    const { validUser, token } = response.data;
    const user: User = {
      id: validUser._id,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: validUser.email,
    };
    
    dispatch(loginSuccess({ user, token, isResponder: validUser.isResponder }));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isResponder', validUser.isResponder.toString())
    localStorage.setItem('responderType', validUser.responderType.toString())
  } catch (error: unknown) {
    let errorMessage = 'Login failed';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }
    dispatch(loginFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

// registration action 
export const register = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  isResponder: boolean,
  responderType: string
) => async (dispatch: AppDispatch): Promise<void> => {
  dispatch(loginStart()); // Reuse loading state
  try {
    await axios.post(`${baseUrl}/auth/signup`, {
      firstName,
      lastName,
      email,
      password,
      isResponder,
      responderType,
    });

    console.log('User registered:', { firstName, lastName, email });

    // auto login on signup 
    const response = await axios.post<LoginResponse>(`${baseUrl}/auth/login`, { email, password });
    console.log('Login response:', response.data);

    const { validUser, token } = response.data;
    const user: User = {
      id: validUser._id,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: validUser.email,
    };

    dispatch(loginSuccess({ user, token, isResponder: validUser.isResponder }));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isResponder', validUser.isResponder.toString())
    localStorage.setItem('responderType', validUser.responderType.toString())
  } catch (error: unknown) {
    let errorMessage = 'Registration failed';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }
    dispatch(registrationFailure(errorMessage));
    console.error('Error during registration:', errorMessage);
    throw new Error(errorMessage);
  }
};


// Logout action
export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('isResponder')
  localStorage.removeItem('responderType')
  localStorage.removeItem('user')
  dispatch(logout());
};