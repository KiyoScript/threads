import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});


const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `${token}` } : {};
};


export const signUpUser = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post("/users", {
      "user": {
        "username": username,
        "email":  email,
        "password": password },
    });

    const token = response.headers.authorization;
    const message = response.data.status.message
    const user = response.data.status.data;

    if (token) {
      await AsyncStorage.setItem("token", token);
    }

    return { message, token, user };
  } catch (error) {
    console.error("Sign-up failed:", error);
    throw error;
  }
};

export const signInUser = async (email_or_username: string, password: string) => {
  try {
    const response = await api.post("/users/sign_in", {
      "user": {
        "email_or_username": email_or_username,
        "password": password },
    });

    const token = response.headers.authorization;
    const user = response.data.status.data;
    const message = response.data.status.message;

    if (token) {
      await AsyncStorage.setItem("token", token);
    }
    return { message, token, user };
  } catch (error) {
    console.error("Sign-in failed:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    const headers = await getAuthHeaders();
    if (!headers?.Authorization) throw new Error("No token found");

    const response = await api.delete("/users/sign_out", { headers });

    await AsyncStorage.removeItem("token");

    return { message: response.data.status.message };
  } catch (error) {
    console.error("Sign-out failed:", error);
    throw error;
  }
};


export const checkUserAuth = async () => {
  const headers = await getAuthHeaders();
  if (!headers?.Authorization) return { message: "Unauthorized Access" };
  try {
    const response = await api.get("/users/me", { headers });
    return { user: response.data.user };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { message: "Unauthorized Access" };
  }
};
