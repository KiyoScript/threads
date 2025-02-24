import { useColorScheme } from "@/lib/useColorScheme";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/useAuthStore";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

import FlashMessage, { showMessage } from "react-native-flash-message";

export default function SignIn() {
  const { isDarkColorScheme } = useColorScheme();
  const { signIn, signOutMessage, checkUserAuthMessage, clearMessage } = useAuthStore();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const [emailOrUsernameError, setEmailOrUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const message = signOutMessage || checkUserAuthMessage;
  const messageType = signOutMessage ? "success" : "info";
  useEffect(() => {
    if (message) {
      showMessage({
        message: message,
        description: "",
        type: messageType,
        icon: "success",
        duration: 3000,
      });
      clearMessage();
    }
  }, [message, messageType, clearMessage]);



  const handleSignIn = async () => {
    setEmailOrUsernameError("");
    setPasswordError("");
    setLoading(true);

    if (!emailOrUsername.trim()) {
      setEmailOrUsernameError("Email or Username is required.");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      setLoading(false);
      return;
    }

    try {
      await signIn(emailOrUsername, password);
      router.replace("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.status?.message || "Invalid credentials.";
      showMessage({
        message: "Error",
        description: errorMessage,
        type: "danger",
        icon: "danger",
        duration: 3000,
      });

      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className={`flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ${isDarkColorScheme ? "bg-[#000000]" : "bg-[#FFFFFF]"}`}>
        <View className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Text className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
            Sign in to your threads account 🙂
          </Text>
        </View>

        <View className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm gap-4">
          <Input
              className={`${emailOrUsernameError || passwordError ? "border-red-500" : ""}`}
              placeholder="Email or Username" value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              aria-labelledby="emailOrUsernameLabel"
              aria-errormessage="inputError"
          />

          {emailOrUsernameError ? (<Text className="text-red-500 text-sm"> {emailOrUsernameError} </Text>) : null}

          <Input
              className={`${passwordError ? "border-red-500" : ""}`}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              aria-labelledby="passwordLabel"
              aria-errormessage="inputError"
          />

          {passwordError ? (<Text className="text-red-500 text-sm"> {passwordError} </Text>) : null}
        </View>

        <View className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm flex items-center">
          <Button onPress={handleSignIn} disabled={loading}>
            {loading ? (
              <View className="flex-row items-center justify-center gap-2">
                <Text>Signing In</Text>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <Text>Sign In</Text>
            )}
          </Button>
        </View>

        <View className="mt-10 items-center sm:mx-auto sm:w-full sm:max-w-sm">
          <TouchableOpacity onPress={() => router.replace("/sign-up")} className="text-center">
            <Text className="text-blue-500">Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>

        <FlashMessage position="top" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

