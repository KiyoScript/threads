import { useColorScheme } from "@/lib/useColorScheme";
import { View, Text } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { isDarkColorScheme } = useColorScheme();
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <View className={`flex-1 items-center justify-center gap-4 ${isDarkColorScheme ? "bg-[#000000]" : "bg-[#FFFFFF]"}`}>
      <Text className="text-2xl font-bold underline text-white">
        Hello, {user?.username}!
      </Text>

      <Button className="mt-4" onPress={handleLogout}>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
