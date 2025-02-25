export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export interface AuthState {
  user: any;
  token: string | null;
  signIn: (email_or_username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
