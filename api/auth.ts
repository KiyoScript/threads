import { api, getAuthHeaders } from "@/utils/api";
import { setToken, removeToken } from "@/utils/storage";
import { AuthResponse } from "@/types/auth";

export const signUpUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post("/users", {
      user: { username, email, password },
    });

    const token = response.headers.authorization;
    const message = response.data.status.message;
    const user = response.data.status.data;

    if (token) await setToken(token);

    return { message, token, user };
  } catch (error) {
    console.error("Sign-up faild:", error)
    throw error;
  }
};

export const signInUser = async (email_or_username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post("/users/sign_in", {
      user: { email_or_username, password },
    });

    const token = response.headers.authorization;
    const message = response.data.status.message;
    const user = response.data.status.data;

    if (token) await setToken(token);
    return { message, token, user };
  } catch (error) {
    console.error("Sign-in failed:", error);
    throw error;
  }
};

export const signOutUser = async (): Promise<{ message: string }> => {
  try {
    const headers = await getAuthHeaders();
    if (!headers?.Authorization) throw new Error("No token found");

    const response = await api.delete("/users/sign_out", { headers });

    await removeToken();

    return { message: response.data.status.message };
  } catch (error) {
    console.error("Sign-out failed:", error);
    throw error;
  }
};

export const checkUserAuth = async (): Promise<AuthResponse> => {
  try {
    const headers = await getAuthHeaders();
    if (!headers?.Authorization) return { message: "Unauthorized Access" };
    const response = await api.get("/users/me", { headers });
    return { user: response.data.user, message: "" };
  } catch (error) {
    console.error("CheckUser-auth failed:", error);
    throw error;
  }
};
