import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

export function useOnboardingActivity() {
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    isMotionEnabled:
      isFocused && appState === "active" && !shouldReduceMotion,
    shouldReduceMotion,
  } as const;
}
