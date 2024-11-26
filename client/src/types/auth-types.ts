
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isResponder: boolean;
  responderType?: string | null;
  loading: boolean;
  error: string | null;
}

export interface ValidUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  responder: boolean;
  responderType?: string; 
}

export interface LoginResponse {
  validUser: ValidUser;
  token: string;
}