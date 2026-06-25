import { useEffect, useRef } from "react";
import {
  Animated,
  ImageBackground,
  Text,
  View,
  type DimensionValue,
} from "react-native";

import { colors } from "@/src/constants/tokens";

import { FoodScanIllustration } from "./components/FoodScanIllustration";

const analysisImage = require("../../../assets/images/Scan-Fruit-Vegetable.png");

type IllustrationProps = {
  id: "scan" | "analyze" | "personalized";
};

export function OnboardingIllustration({ id }: IllustrationProps) {
  if (id === "scan") {
    return <FoodScanIllustration />;
  }

  if (id === "analyze") {
    return <AnalyzeIllustration />;
  }

  return <PersonalizedIllustration />;
}

function AnalyzeIllustration() {
  const scanProgress = useRef(new Animated.Value(0)).current;
  const floatProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanProgress, {
          duration: 1800,
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
          duration: 1500,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(floatProgress, {
          duration: 1500,
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
    outputRange: [0, 214],
  });
  const firstFloatY = floatProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });
  const secondFloatY = floatProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 4],
  });

  return (
    <View className="w-full items-center justify-center py-3">
      <View className="absolute left-1 h-56 w-44 rounded-full bg-[#61DE8A] opacity-20" />
      <View className="absolute right-0 h-60 w-48 rounded-full bg-[#58BCFD] opacity-20" />

      <View
        className="h-[360px] w-full max-w-[320px] overflow-hidden rounded-[32px] border border-white bg-card"
        style={{ boxShadow: "0 16px 34px rgba(16, 24, 40, 0.10)" }}
      >
        <ImageBackground
          imageStyle={{ opacity: 0.88 }}
          resizeMode="cover"
          source={analysisImage}
          className="flex-1"
        >
          <View className="flex-1 bg-white/45 px-5 py-6">
            <View
              className="rounded-[22px] bg-white/80 p-4"
              style={{ boxShadow: "0 8px 24px rgba(16, 24, 40, 0.12)" }}
            >
              <View className="border-b-2 border-[#E5ECE7] pb-4">
                <View className="h-4 w-44 rounded bg-[#EEEEF0]" />
                <View className="mt-3 h-2 w-32 rounded bg-[#E2E2E5]" />
              </View>

              <View className="mt-4 flex-row gap-3">
                <Animated.View
                  style={{ flex: 1, transform: [{ translateY: firstFloatY }] }}
                >
                  <MetricCard
                    color={colors.primaryDark}
                    label="Năng lượng"
                    valueWidth="66%"
                  />
                </Animated.View>
                <Animated.View
                  style={{ flex: 1, transform: [{ translateY: secondFloatY }] }}
                >
                  <MetricCard color="#006492" label="Đạm" valueWidth="50%" />
                </Animated.View>
              </View>

              <View className="mt-5 rounded-[16px] border border-primary-100 bg-primary-50/90 p-4">
                <View className="flex-row gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-600">
                    <Text className="text-sm font-bold text-white">AI</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-primary-700">
                      Khuyến nghị AI
                    </Text>
                    <Text className="mt-1 text-xs leading-4 text-muted">
                      Đang phân tích sự phối hợp thành phần cho sức khỏe tiêu
                      hóa...
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View
            className="absolute inset-x-0 top-0 h-full bg-primary-700/10"
            pointerEvents="none"
          />
          <Animated.View
            pointerEvents="none"
            className="absolute left-10 right-10 top-16 h-1 rounded-full bg-primary-700"
            style={{
              boxShadow: "0 0 15px rgba(0, 109, 55, 0.65)",
              transform: [{ translateY: scanTranslateY }],
            }}
          />
        </ImageBackground>
      </View>
    </View>
  );
}

function MetricCard({
  color,
  label,
  valueWidth,
}: {
  color: string;
  label: string;
  valueWidth: DimensionValue;
}) {
  return (
    <View
      className="rounded-[16px] border border-white/70 bg-white/85 p-3"
      style={{ boxShadow: "0 3px 10px rgba(16, 24, 40, 0.10)" }}
    >
      <View className="flex-row items-center gap-2">
        <View
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <Text className="text-xs font-semibold text-muted">{label}</Text>
      </View>
      <View className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEEEF0]">
        <View
          className="h-full rounded-full"
          style={{ backgroundColor: color, width: valueWidth }}
        />
      </View>
    </View>
  );
}

function PersonalizedIllustration() {
  return (
    <View className="w-full items-center justify-center py-3">
      <View className="absolute h-72 w-72 rounded-full bg-primary-600 opacity-10" />
      <View className="absolute right-8 top-4 h-11 w-11 rotate-12 rounded-full bg-[#FFE7C2]" />
      <View className="absolute bottom-16 left-8 h-11 w-11 -rotate-12 rounded-full bg-[#DDF3FF]" />
      <View
        className="w-[280px] rounded-[12px] border-t-4 border-primary-700 bg-card px-6 pb-6 pt-7"
        style={{ boxShadow: "0 16px 32px rgba(16, 24, 40, 0.08)" }}
      >
        <View className="flex-row items-start justify-between">
          <View className="gap-2">
            <View className="h-4 w-32 rounded-full bg-[#E8E8EA]" />
            <View className="h-3 w-20 rounded-full bg-[#EEEEF0]" />
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-600">
            <Text className="text-xl font-bold text-white">✓</Text>
          </View>
        </View>

        <View className="mt-7 gap-4">
          <ReportRow accent="#58BCFD" width={40} />
          <ReportRow accent="#D98437" width={48} />
          <ReportRow accent={colors.border} width={32} />
        </View>

        <View className="mt-5 rounded-[8px] border border-[#DDE8DD] bg-[#F3F3F6] p-3">
          <Text className="text-center text-sm font-semibold text-muted">
            Recommended for You
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReportRow({ accent, width }: { accent: string; width: number }) {
  return (
    <View className="flex-row items-center gap-3">
      <View
        className="h-8 w-8 rounded-[8px]"
        style={{ backgroundColor: `${accent}33` }}
      />
      <View className="h-3 flex-1 rounded-full bg-[#EEEEF0]" />
      <View className="h-3 rounded-full bg-[#61DE8A]" style={{ width }} />
    </View>
  );
}
