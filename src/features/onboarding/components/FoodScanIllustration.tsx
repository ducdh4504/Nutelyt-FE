import { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";

const onboardingImage = require("../../../../assets/images/onboarding1-bg.png");

export function FoodScanIllustration() {
  const floatProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatProgress, {
          duration: 2200,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(floatProgress, {
          duration: 2200,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    floatLoop.start();

    return () => {
      floatLoop.stop();
    };
  }, [floatProgress]);

  const cardFloatY = floatProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });
  const cardScale = floatProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.012],
  });

  return (
    <View className="w-full items-center justify-center py-4">
      <View className="absolute h-72 w-72 rounded-full bg-[#7EFBA4] opacity-10" />
      <View className="absolute -bottom-3 h-44 w-64 rounded-full bg-[#8CCDFF] opacity-10" />

      <Animated.View
        className="h-80 w-full max-w-[320px] overflow-hidden rounded-[28px] border-4 border-white bg-card p-2"
        style={{
          boxShadow: "0 16px 30px rgba(16, 24, 40, 0.10)",
          transform: [{ translateY: cardFloatY }, { scale: cardScale }],
        }}
      >
        <View className="flex-1 overflow-hidden rounded-[22px] bg-[#EAF8EF]">
          <Image
            accessibilityLabel="Food scanning onboarding illustration"
            className="h-full w-full"
            resizeMode="cover"
            source={onboardingImage}
          />
          <View
            className="absolute inset-0"
            pointerEvents="none"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.10)" }}
          />
          <View
            className="absolute inset-x-0 bottom-0 h-20"
            pointerEvents="none"
            style={{ backgroundColor: "rgba(234, 248, 239, 0.18)" }}
          />
        </View>
      </Animated.View>
    </View>
  );
}
