import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../components/app-header';
import { BottomTabBar } from '../components/bottom-tab-bar';
import type { RouteProfileParams } from '../types';
import { parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ScanCameraScreen() {
  const params = useLocalSearchParams<RouteProfileParams>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useMemo(() => parseHealthProfileParam(params), [params]);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const [permission, requestPermission] = useCameraPermissions();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { duration: 260, toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { damping: 18, stiffness: 150, toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const openResult = () => {
    router.push({
      pathname: '/analysis-result',
      params: { profile: profileParam, foodId: 'bun-bo-hue' },
    } as unknown as Href);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: '/dashboard', params: { profile: profileParam } } as unknown as Href);
    }
  };

  const renderCameraContent = () => {
    if (!permission) {
      return (
        <View className="flex-1 items-center justify-center bg-[#101614] px-8">
          <Text className="text-center text-base leading-6 text-white">
            Đang chuẩn bị camera...
          </Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View className="flex-1 items-center justify-center gap-4 bg-[#101614] px-8">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Feather color="#FFFFFF" name="camera-off" size={28} />
          </View>
          <Text className="text-center text-lg font-semibold text-white">Cần quyền camera</Text>
          <Text className="text-center text-base leading-6 text-white/75">
            Nutelyt cần quyền camera để mô phỏng thao tác quét. Bạn vẫn có thể quay lại màn hình
            chính bất kỳ lúc nào.
          </Text>
          <Pressable
            accessibilityRole="button"
            className="h-12 items-center justify-center rounded-[12px] bg-primary-600 px-5"
            onPress={requestPermission}
          >
            <Text className="text-base text-white">Cho phép camera</Text>
          </Pressable>
        </View>
      );
    }

    return <CameraView facing="back" style={{ flex: 1 }} />;
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <AppHeader onBack={goBack} rightIcon="more-vertical" />
      <Animated.View
        className="flex-1 px-5 pt-5"
        style={{ opacity, transform: [{ translateY }] }}
      >
        <View className="flex-1 overflow-hidden rounded-[20px] bg-[#101614]">
          {renderCameraContent()}
          <View className="absolute inset-0 items-center justify-center px-8">
            <View className="aspect-square w-full max-w-[280px] rounded-[28px] border-2 border-white/85">
              <View className="absolute -left-1 -top-1 h-12 w-12 rounded-tl-[28px] border-l-4 border-t-4 border-primary-600" />
              <View className="absolute -right-1 -top-1 h-12 w-12 rounded-tr-[28px] border-r-4 border-t-4 border-primary-600" />
              <View className="absolute -bottom-1 -left-1 h-12 w-12 rounded-bl-[28px] border-b-4 border-l-4 border-primary-600" />
              <View className="absolute -bottom-1 -right-1 h-12 w-12 rounded-br-[28px] border-b-4 border-r-4 border-primary-600" />
            </View>
          </View>
          <View className="absolute left-6 right-6 top-8 rounded-[12px] bg-black/35 p-3">
            <Text className="text-center text-base leading-6 text-white">
              Đưa món ăn hoặc nhãn sản phẩm vào khung để quét
            </Text>
          </View>
        </View>

        <View className="gap-3 pb-[116px] pt-5">
          <AnimatedPressable
            accessibilityRole="button"
            className="h-16 flex-row items-center justify-center gap-3 rounded-full bg-primary-600"
            onPress={openResult}
            onPressIn={() => {
              Animated.spring(scale, { damping: 12, stiffness: 260, toValue: 0.96, useNativeDriver: true }).start();
            }}
            onPressOut={() => {
              Animated.spring(scale, { damping: 12, stiffness: 260, toValue: 1, useNativeDriver: true }).start();
            }}
            style={{ boxShadow: '0 10px 20px rgba(39,174,96,0.26)', transform: [{ scale }] }}
          >
            <Feather color="#FFFFFF" name="camera" size={22} />
            <Text className="text-base font-semibold text-white">Quét mẫu sản phẩm</Text>
          </AnimatedPressable>
          <Text className="text-center text-sm leading-5 text-muted">
            Bản prototype dùng dữ liệu mẫu, chưa nhận diện thực phẩm thật.
          </Text>
        </View>
      </Animated.View>
      <BottomTabBar active="scan" profileParam={profileParam} />
    </View>
  );
}
