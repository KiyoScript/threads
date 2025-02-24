import { Tabs, Redirect } from "expo-router";
import * as React from "react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

import { Text } from "@/components/ui/text";
import { House } from "@/lib/icons/House";


export default function TabLayout() {
  const { user, loading, checkAuth } = useAuthStore();
  const memoizedCheckAuth = React.useCallback(checkAuth, [checkAuth, useAuthStore]);

  useEffect(() => {
    memoizedCheckAuth();
  }, [memoizedCheckAuth]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

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

