import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInUser, signOutUser, signUpUser, checkUserAuth } from "@/api/auth";

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  signIn: (email_or_username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  signUp: async (username, email, password) => {
    try {
      const user = await signUpUser(username, email, password);
      set({ user });
    } catch (error) {
      console.error("Sign-up failed:", error);
      throw error;
    }
  },

  signIn: async (email_or_username, password) => {
    try {
      const { token, user } = await signInUser(email_or_username, password);
      if (token) {
        await AsyncStorage.setItem("token", token);
        set({ token, user });
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOutUser();
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const { user } = await checkUserAuth();
      set({ user, token });
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ user: null, token: null });
    } finally {
      set({ loading: false });
    }
  },
}));
