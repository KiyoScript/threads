import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInUser, signOutUser, signUpUser, checkUserAuth } from "@/api/auth";

interface AuthState {
  user: any;
  token: string | null;
  signUpMessage: string | null;
  signInMessage: string | null;
  signOutMessage: string | null;
  checkUserAuthMessage: string | null;
  loading: boolean;
  signIn: (email_or_username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearMessage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  signUpMessage: null,
  signInMessage: null,
  signOutMessage: null,
  checkUserAuthMessage: null,
  loading: true,

  signUp: async (username, email, password) => {
    try {
      const { message, user, token } = await signUpUser(username, email, password);
      if (token) {
        await AsyncStorage.setItem("token", token);
        set({ token, user, signUpMessage: message });
      }
    } catch (error) {
      console.error("Sign-up failed:", error);
      throw error;
    }
  },

  signIn: async (email_or_username, password) => {
    try {
      const { token, user, message } = await signInUser(email_or_username, password);
      if (token) {
        await AsyncStorage.setItem("token", token);
        set({ token, user, signInMessage: message  });
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { message } = await signOutUser();
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null, signOutMessage: message });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        set({ user: null, token: null, checkUserAuthMessage: "Unauthorized Access" });
        return;
      }
      const { user, message } = await checkUserAuth();
      set({ user, token, checkUserAuthMessage: message });
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ user: null, token: null, checkUserAuthMessage: "Auth check failed" });
    } finally {
      set({ loading: false });
    }
  },

  clearMessage: () => set({ signUpMessage: null, signInMessage: null, signOutMessage: null }),
}));
