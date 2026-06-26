import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Typography } from '@/src/components/ui';

import { AuthGoogleButton } from './components/auth-google-button';
import { AuthTextInput } from './components/auth-text-input';

const logoImage = require('../../../assets/images/Nutelyt-logo.png');
const wordmarkImage = require('../../../assets/images/Nutelyt-text.png');

export function LoginScreen() {
  const [rememberMe, setRememberMe] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior="padding">
      <View
        className="flex-1 bg-background"
        style={{ paddingTop: insets.top }}
      >
        <View className="h-14 items-center justify-center border-b border-[#EEF2EE] px-5">
          <Image
            accessibilityLabel="Nutelyt"
            className="h-7 w-28"
            resizeMode="contain"
            source={wordmarkImage}
          />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Math.max(insets.bottom + 20, 36),
            paddingHorizontal: 20,
            paddingTop: 36,
          }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[440px] flex-1 self-center">
            <View className="overflow-hidden rounded-[12px] bg-card">
              <Image
                accessibilityLabel="Nutelyt logo"
                className="h-[196px] w-full"
                resizeMode="cover"
                source={logoImage}
              />
            </View>

            <View className="gap-2 pt-8">
              <Typography
                className="text-center text-[26px] font-semibold leading-9"
                variant="subtitle"
              >
                Chào mừng bạn quay trở lại!
              </Typography>
              <Typography className="text-center text-base leading-6" tone="muted">
                Đăng nhập để theo dõi tiến trình dinh dưỡng của bạn.
              </Typography>
            </View>

            <View className="gap-4 pt-8">
              <AuthTextInput
                autoCapitalize="none"
                autoComplete="email"
                icon="mail"
                keyboardType="email-address"
                label="Email"
                placeholder="name@example.com"
                textContentType="emailAddress"
              />
              <AuthTextInput
                autoCapitalize="none"
                canToggleSecureEntry
                icon="lock"
                label="Mật Khẩu"
                placeholder="••••••••"
                secureTextEntry
                textContentType="password"
              />

              <View className="flex-row items-center justify-between px-1">
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: rememberMe }}
                  className="min-h-11 flex-row items-center gap-3"
                  onPress={() => setRememberMe((current) => !current)}
                >
                  <View className="h-6 w-6 items-center justify-center rounded-[6px] border-2 border-border bg-card">
                    {rememberMe ? (
                      <Feather color="#1E732B" name="check" size={15} />
                    ) : null}
                  </View>
                  <Text className="text-sm font-semibold text-muted">
                    Lưu đăng nhập
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  className="min-h-11 justify-center"
                >
                  <Text className="text-sm font-semibold text-[#006492]">
                    Quên mật khẩu?
                  </Text>
                </Pressable>
              </View>

              <Button
                className="h-14 rounded-[12px] border-primary-600 bg-primary-600"
                onPress={() => undefined}
                size="lg"
                textClassName="font-normal"
              >
                Đăng nhập
              </Button>
            </View>

            <View className="flex-row items-center gap-4 pt-8">
              <View className="h-px flex-1 bg-border" />
              <Text className="text-sm font-semibold text-[#6D7A6E]">
                Hoặc đăng nhập với
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            <AuthGoogleButton className="mt-6" onPress={() => undefined} />

            <Pressable
              accessibilityRole="link"
              className="min-h-16 items-center justify-center pt-6"
              onPress={() => router.push('/register')}
            >
              <Text className="text-center text-base text-muted">
                Tôi chưa có tài khoản?{' '}
                <Text className="font-bold text-[#1E732B]">Đăng ký</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
