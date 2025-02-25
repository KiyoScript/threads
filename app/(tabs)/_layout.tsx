import { useEffect } from "react";
import { Tabs } from "expo-router";
import { House } from "@/lib/icons/House";
import { useAuthStore } from "@/store/useAuthStore";

export default function TabLayout() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
          title: "",
        }}
      />
    </Tabs>
  );
}
