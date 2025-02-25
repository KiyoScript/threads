import { useState } from "react";
import { router } from "expo-router";
import { useColorScheme } from "@/lib/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";


import { useAuthStore } from "@/store/useAuthStore";
import { useLoadingStore } from "@/store/useLoadingStore";


import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const { isDarkColorScheme } = useColorScheme();

  const { signUp } = useAuthStore();
  const { isLoading, setLoading } = useLoadingStore();


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");


  const handleSignUp = async () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setLoading(true);

    if (!username.trim()) {
      setUsernameError("Username is required.");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setEmailError("Email is required.");
      setLoading(false);
      return;
    }

    if (password.trim().length < 8) {
      setPasswordError("Password should be at least 8 characters.");
      setLoading(false);
      return;
    }
    await signUp(username, email, password);
    router.replace("/");
    setLoading(false);
  };

  return (
    <SafeAreaView className={`flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ${isDarkColorScheme ? "bg-[#000000]" : "bg-[#FFFFFF]"}`}>
      <View className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Text className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
          Create a new account to join Threads! 🙂
        </Text>
      </View>
      <View className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm gap-4">
        <Input className={`${usernameError || emailError || passwordError ? "border-red-500" : ""   }`}
                placeholder="Username" value={username}
                onChangeText={setUsername}
                aria-labelledby="usernameLabel"
                aria-errormessage="inputError"/>
        {usernameError ? (<Text className="text-red-500 text-sm"> {usernameError} </Text>) : null}


        <Input className={`${usernameError || emailError || passwordError ? "border-red-500" : ""   }`}
                placeholder="Email" value={email}
                onChangeText={setEmail}
                aria-labelledby="emailLabel"
                aria-errormessage="inputError"/>

        {emailError ? (<Text className="text-red-500 text-sm"> {emailError} </Text>) : null}

        <Input className={`${usernameError || emailError || passwordError ? "border-red-500" : ""   }`}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                aria-labelledby="passwordLabel"
                aria-errormessage="inputError"/>

        {passwordError ? (<Text className="text-red-500 text-sm"> {passwordError} </Text>) : null}
      </View>

      <View className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <Button onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <View className="flex-row items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">
              <ActivityIndicator size="small" color="black" />
            </View>
          ) : (
            <Text>Sign Up</Text>
          )}
        </Button>
      </View>

      <View className="mt-10 items-center sm:mx-auto sm:w-full sm:max-w-sm">
        <TouchableOpacity onPress={() => router.replace("/sign-in")} className="text-center">
          <Text className="text-blue-500">Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
