import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `${token}` } : {};
};

export const handleApiError = (error: any) => {
  return error.response?.data?.status?.message;
};
