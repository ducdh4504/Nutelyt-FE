import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

export function FoodScanIllustration() {
  const scanProgress = useRef(new Animated.Value(0)).current;
  const floatProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanProgress, {
          duration: 1700,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(scanProgress, {
          duration: 0,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatProgress, {
          duration: 1800,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(floatProgress, {
          duration: 1800,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    scanLoop.start();
    floatLoop.start();

    return () => {
      scanLoop.stop();
      floatLoop.stop();
    };
  }, [floatProgress, scanProgress]);

  const scanTranslateY = scanProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 95],
  });
  const cardFloatY = floatProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  return (
    <View className="w-full items-center justify-center py-4">
      <View className="absolute h-72 w-72 rounded-full bg-[#7EFBA4] opacity-20" />

      <Animated.View
        className="h-80 w-full max-w-[320px] overflow-hidden rounded-[24px] border-4 border-white bg-card p-4"
        style={{
          boxShadow: "0 16px 30px rgba(16, 24, 40, 0.10)",
          transform: [{ translateY: cardFloatY }],
        }}
      >
        <View className="flex-1 overflow-hidden rounded-[18px] bg-[#EAF8EF] p-4">
          <View className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white opacity-50" />
          <View className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#61DE8A] opacity-20" />

          <View
            className="rounded-[16px] bg-white p-4"
            style={{ boxShadow: "0 8px 18px rgba(16, 24, 40, 0.08)" }}
          >
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <View className="h-4 w-40 rounded-full bg-[#DDEBE2]" />
                <View className="mt-2 h-3 w-24 rounded-full bg-[#E8E8EA]" />
              </View>
              <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-600">
                <Text className="text-base font-bold text-white">✓</Text>
              </View>
            </View>

            <View className="overflow-hidden rounded-[12px] border border-[#D8E3DC] bg-[#FAFFFC] p-3">
              <View className="flex-row items-end justify-center gap-1">
                {Array.from({ length: 18 }).map((_, index) => (
                  <View
                    key={index}
                    className="rounded-full bg-[#111827]"
                    style={{
                      height: index % 4 === 0 ? 58 : index % 3 === 0 ? 44 : 52,
                      opacity: index % 5 === 0 ? 0.55 : 0.95,
                      width: index % 2 === 0 ? 4 : 7,
                    }}
                  />
                ))}
              </View>

              <Animated.View
                className="absolute left-4 right-4 top-3 h-1 rounded-full bg-primary-700"
                style={{
                  boxShadow: "0 0 14px rgba(0, 109, 55, 0.55)",
                  transform: [{ translateY: scanTranslateY }],
                }}
              />
            </View>
          </View>

          <View className="mt-4 rounded-[16px] bg-white/90 p-4">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                <View className="h-4 w-4 rounded-full bg-primary-600" />
              </View>
              <View className="flex-1 gap-2">
                <View className="h-3 w-11/12 rounded-full bg-[#E2E2E5]" />
                <View className="h-3 w-8/12 rounded-full bg-[#EEEEF0]" />
              </View>
            </View>

            <View className="mt-4 gap-2">
              <View className="h-2.5 rounded-full bg-[#EEEEF0]" />
              <View className="h-2.5 w-9/12 rounded-full bg-[#EEEEF0]" />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
