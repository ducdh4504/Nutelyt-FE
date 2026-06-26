import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  function goToLogin() {
    router.replace('/login');
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior="padding">
      <View
        className="flex-1 bg-background"
        style={{ paddingTop: insets.top }}
      >
        <View className="h-14 flex-row items-center justify-center border-b border-[#EEF2EE] px-5">
          <Pressable
            accessibilityLabel="Quay lại đăng nhập"
            accessibilityRole="button"
            className="absolute left-3 h-12 w-12 items-center justify-center rounded-full"
            onPress={goToLogin}
          >
            <Feather color="#006D37" name="arrow-left" size={24} />
          </Pressable>
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
            paddingBottom: Math.max(insets.bottom + 20, 40),
            paddingHorizontal: 20,
            paddingTop: 56,
          }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[448px] flex-1 self-center">
            <View className="items-center gap-5">
              <Image
                accessibilityLabel="Nutelyt logo"
                className="h-[172px] w-[306px] rounded-[12px]"
                resizeMode="cover"
                source={logoImage}
              />
              <Typography className="max-w-[280px] text-center text-base leading-6" tone="muted">
                Thấu hiểu hơn, chính xác hơn đồng hành cùng sức khỏe của bạn bằng sức mạnh AI.
              </Typography>
            </View>

            <View className="gap-4 pt-9">
              <AuthTextInput
                autoCapitalize="words"
                icon="user"
                label="Họ và Tên"
                placeholder="Họ và Tên"
                textContentType="name"
              />
              <AuthTextInput
                autoCapitalize="none"
                autoComplete="email"
                icon="mail"
                keyboardType="email-address"
                label="Email"
                placeholder="yourname@example.com"
                textContentType="emailAddress"
              />
              <AuthTextInput
                autoCapitalize="none"
                canToggleSecureEntry
                icon="lock"
                label="Mật khẩu"
                placeholder="Tối thiểu 8 ký tự"
                secureTextEntry
                textContentType="newPassword"
              />
              <AuthTextInput
                autoCapitalize="none"
                icon="shield"
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                secureTextEntry
                textContentType="newPassword"
              />

              <Button
                className="mt-2 h-14 rounded-[12px] border-primary-600 bg-primary-600"
                onPress={() => undefined}
                size="lg"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-sm font-semibold text-white">
                    Tạo Tài Khoản
                  </Text>
                  <Feather color="#FFFFFF" name="arrow-right" size={18} />
                </View>
              </Button>
            </View>

            <View className="flex-row items-center gap-4 pt-6">
              <View className="h-px flex-1 bg-border" />
              <Text className="text-sm font-semibold text-[#6D7A6E]">Hoặc</Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            <AuthGoogleButton
              className="mt-5 border-[#006492] bg-transparent"
              onPress={() => undefined}
              textClassName="text-sm font-semibold text-[#006492]"
            />

            <Pressable
              accessibilityRole="link"
              className="min-h-16 items-center justify-center pt-6"
              onPress={goToLogin}
            >
              <Text className="text-center text-base text-muted">
                Bạn đã có tài khoản?{' '}
                <Text className="font-bold text-[#006D37]">Đăng nhập</Text>
              </Text>
            </Pressable>

            <Text className="pt-5 text-center text-xs leading-[18px] text-[#6D7A6E] opacity-60">
              By registering, you agree to Nutelyt Terms of Service{'\n'}
              and Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
