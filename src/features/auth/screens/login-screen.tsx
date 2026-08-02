import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui";
import { routes } from "@/config/routes";

import { AUTH_FONT_FAMILY, authColors } from "../auth-theme";
import { AuthCard } from "../components/auth-card";
import { AuthDivider } from "../components/auth-divider";
import { AuthFeedback } from "../components/auth-feedback";
import { AuthGoogleButton } from "../components/auth-google-button";
import { AuthScreenShell } from "../components/auth-screen-shell";
import { AuthTextInput } from "../components/auth-text-input";
import { useLoginForm } from "../hooks/use-login-form";
import { useUnavailableAuthAction } from "../hooks/use-unavailable-auth-action";

const UNAVAILABLE_MESSAGE = "Tính năng này hiện chưa khả dụng.";

export function LoginScreen() {
  const router = useRouter();
  const passwordRef = useRef<TextInput>(null);
  const navigationLock = useRef(false);
  const {
    fieldErrors,
    isSubmitting,
    setField,
    submissionError,
    submit,
    values,
  } = useLoginForm();
  const { feedback, pendingAction, showUnavailable } =
    useUnavailableAuthAction();

  function goToRegister() {
    if (navigationLock.current || isSubmitting) return;
    navigationLock.current = true;
    router.push(routes.register);
  }

  return (
    <AuthScreenShell mainPaddingTop={57}>
      <AuthCard>
        <View className="gap-2">
          <Text
            className="text-center text-[28px] font-bold leading-9"
            style={{ color: authColors.foreground, fontFamily: AUTH_FONT_FAMILY }}
          >
            Chào mừng bạn quay lại
          </Text>
          <Text
            className="text-center text-base leading-6"
            style={{ color: authColors.muted, fontFamily: AUTH_FONT_FAMILY }}
          >
            Tiếp tục hành trình dinh dưỡng cùng AI đồng hành của bạn.
          </Text>
        </View>

        <View className="mt-8 gap-4">
          <AuthTextInput
            autoCapitalize="none"
            autoComplete="email"
            error={fieldErrors.email}
            icon="email"
            keyboardType="email-address"
            label="Email"
            onChangeText={(value) => setField("email", value)}
            onSubmitEditing={() => passwordRef.current?.focus()}
            placeholder="nutelyt@vidu.com"
            returnKeyType="next"
            textContentType="emailAddress"
            value={values.email}
          />

          <AuthTextInput
            ref={passwordRef}
            autoCapitalize="none"
            canToggleSecureEntry
            error={fieldErrors.password}
            icon="lock"
            label="Mật khẩu"
            labelAccessory={
              <Pressable
                accessibilityLabel="Quên mật khẩu"
                accessibilityRole="button"
                className="min-h-11 justify-center"
                hitSlop={4}
                onPress={() =>
                  showUnavailable(
                    "forgot-password",
                    "Khôi phục mật khẩu hiện chưa khả dụng.",
                  )
                }
              >
                <Text
                  className="text-sm font-bold leading-5"
                  style={{ color: authColors.primary, fontFamily: AUTH_FONT_FAMILY }}
                >
                  Quên mật khẩu?
                </Text>
              </Pressable>
            }
            onChangeText={(value) => setField("password", value)}
            onSubmitEditing={submit}
            placeholder="••••••••"
            returnKeyType="done"
            secureTextEntry
            textContentType="password"
            value={values.password}
          />

          <AuthFeedback message={submissionError || feedback} />

          <Button
            accessibilityLabel="Đăng nhập"
            accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
            className="h-14 rounded-[12px] border-[#006D33] bg-[#006D33]"
            loading={isSubmitting}
            onPress={submit}
            size="lg"
            style={{
              backgroundColor: authColors.primary,
              borderColor: authColors.primary,
            }}
            textClassName="text-xl font-semibold leading-7"
          >
            Đăng nhập
          </Button>
        </View>

        <View className="mt-8">
          <AuthDivider label="Hoặc" />
        </View>

        <AuthGoogleButton
          className="mt-8"
          label="Đăng nhập bằng Google"
          loading={pendingAction === "google-login"}
          onPress={() => showUnavailable("google-login", UNAVAILABLE_MESSAGE)}
        />

        <Pressable
          accessibilityLabel="Mở màn hình đăng ký"
          accessibilityRole="link"
          className="mt-5 min-h-11 items-center justify-center"
          onPress={goToRegister}
        >
          <Text
            className="text-center text-base leading-6"
            style={{ color: authColors.muted, fontFamily: AUTH_FONT_FAMILY }}
          >
            Chưa có tài khoản?{" "}
            <Text style={{ color: authColors.primary, fontWeight: "700" }}>
              Đăng ký ngay
            </Text>
          </Text>
        </Pressable>
      </AuthCard>

      <View className="mt-8 flex-row items-center justify-center gap-7">
        {["Điều khoản", "Bảo mật", "Hỗ trợ"].map((label) => (
          <Pressable
            key={label}
            accessibilityRole="link"
            className="min-h-11 justify-center"
            onPress={() => showUnavailable(`support-${label}`, UNAVAILABLE_MESSAGE)}
          >
            <Text
              className="text-xs leading-4 opacity-60"
              style={{ color: authColors.muted, fontFamily: AUTH_FONT_FAMILY }}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </AuthScreenShell>
  );
}
