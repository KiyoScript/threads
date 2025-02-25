import "@/global.css";

import { Theme, ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, LogBox } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

import FlashMessage from "react-native-flash-message";

import { Slot } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

LogBox.ignoreAllLogs(true); //ignore all warnings

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router"; // Catch any errors thrown by the Layout component.


export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  const { checkAuth } = useAuthStore();
  const memoizedCheckAuth = React.useCallback(checkAuth, [checkAuth, useAuthStore]);

  useEffect(() => {
    if (isColorSchemeLoaded) {
      memoizedCheckAuth();
    }
  }, [isColorSchemeLoaded, memoizedCheckAuth]);

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Slot />
      <FlashMessage position="top" />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect = Platform.OS === "web" && typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
