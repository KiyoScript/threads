import { create } from "zustand";
import { signInUser, signUpUser, signOutUser, checkUserAuth } from "@/api/auth";
import { showMessage } from "react-native-flash-message";
import { handleApiError } from "@/utils/api";
import { AuthState } from "@/types/auth"
import { useLoadingStore } from "@/store/useLoadingStore";
import { router } from "expo-router";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  signIn: async (email_or_username, password) => {
    useLoadingStore.getState().setLoading(true);
    try {
      const { token, user, message } = await signInUser(email_or_username, password);
      if (token) {
        set({ token, user });
        showMessage({ message, type: "success", icon: "success" });
      }
    } catch (error) {
      showMessage({ message: "Login failed", description: handleApiError(error), type: "danger", icon: "danger" });
    } finally {
      useLoadingStore.getState().setLoading(false);
    }
  },

  signUp: async (username, email, password) => {
    useLoadingStore.getState().setLoading(true);
    try {
      const { token, user, message } = await signUpUser(username, email, password);
      if (token) {
        set({ token, user });
        showMessage({ message, type: "success", icon: "success" });
      }
    } catch (error) {
      showMessage({ message: "Sign-up failed", description: handleApiError(error), type: "danger", icon: "danger" });
    } finally {
      useLoadingStore.getState().setLoading(false);
    }
  },

  signOut: async () => {
    try {
      await signOutUser();
      set({ user: null, token: null });
      showMessage({ message: "Signed out successfully", type: "success", icon: "success" });
    } catch (error) {
      showMessage({ message: "Sign-out failed", description: handleApiError(error), type: "danger", icon: "danger" });
    }
  },

  checkAuth: async () => {
    useLoadingStore.getState().setLoading(true);
    try {
      const { user } = await checkUserAuth();
      if (user) {
        set({ user });
        router.replace("/");
      } else {
        set({ user: null, token: null });
        router.replace("/sign-in");
      }
    } catch {
      set({ user: null, token: null });
      router.replace("/sign-in");
    } finally {
      useLoadingStore.getState().setLoading(false);
    }
  },
}));
