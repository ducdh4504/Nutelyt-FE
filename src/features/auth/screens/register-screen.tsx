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
import { useRegisterForm } from "../hooks/use-register-form";
import { useUnavailableAuthAction } from "../hooks/use-unavailable-auth-action";

export function RegisterScreen() {
  const router = useRouter();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const navigationLock = useRef(false);
  const {
    fieldErrors,
    isSubmitting,
    setField,
    submissionError,
    submit,
    values,
  } = useRegisterForm();
  const { feedback, pendingAction, showUnavailable } =
    useUnavailableAuthAction();

  function goToLogin() {
    if (navigationLock.current || isSubmitting) return;
    navigationLock.current = true;
    if (router.canGoBack()) router.back();
    else router.replace(routes.login);
  }

  return (
    <AuthScreenShell decoration mainPaddingTop={20}>
      <View className="gap-2">
        <Text
          className="text-center text-base leading-6"
          style={{ color: authColors.foreground, fontFamily: AUTH_FONT_FAMILY }}
        >
          Tạo tài khoản mới
        </Text>
        <Text
          className="text-center text-base leading-6"
          style={{ color: authColors.muted, fontFamily: AUTH_FONT_FAMILY }}
        >
          Chào mừng bạn! Hãy bắt đầu hành trình dinh dưỡng thông minh cùng Nutelyt.
        </Text>
      </View>

      <View className="mt-6">
        <AuthCard style={{ paddingTop: 32 }}>
          <View className="gap-6">
            <AuthTextInput
              autoCapitalize="words"
              compact
              error={fieldErrors.fullName}
              icon="user"
              label="Họ và Tên"
              onChangeText={(value) => setField("fullName", value)}
              onSubmitEditing={() => emailRef.current?.focus()}
              placeholder="Nguyễn Văn A"
              returnKeyType="next"
              textContentType="name"
              value={values.fullName}
            />
            <AuthTextInput
              ref={emailRef}
              autoCapitalize="none"
              autoComplete="email"
              compact
              error={fieldErrors.email}
              icon="email"
              keyboardType="email-address"
              label="Email"
              onChangeText={(value) => setField("email", value)}
              onSubmitEditing={() => passwordRef.current?.focus()}
              placeholder="example@gmail.com"
              returnKeyType="next"
              textContentType="emailAddress"
              value={values.email}
            />
            <AuthTextInput
              ref={passwordRef}
              autoCapitalize="none"
              canToggleSecureEntry
              compact
              error={fieldErrors.password}
              icon="lock"
              label="Mật khẩu"
              onChangeText={(value) => setField("password", value)}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              placeholder="••••••••"
              returnKeyType="next"
              secureTextEntry
              textContentType="newPassword"
              value={values.password}
            />
            <AuthTextInput
              ref={confirmPasswordRef}
              autoCapitalize="none"
              compact
              error={fieldErrors.confirmPassword}
              icon="shield"
              label="Xác nhận mật khẩu"
              onChangeText={(value) => setField("confirmPassword", value)}
              onSubmitEditing={submit}
              placeholder="••••••••"
              returnKeyType="done"
              secureTextEntry
              textContentType="newPassword"
              value={values.confirmPassword}
            />

            <AuthFeedback message={submissionError || feedback} />

            <Button
              accessibilityLabel="Đăng ký"
              accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
              className="h-14 rounded-[12px] border-[#006D33] bg-[#006D33]"
              loading={isSubmitting}
              onPress={submit}
              size="lg"
              style={{
                backgroundColor: authColors.primary,
                borderColor: authColors.primary,
              }}
              textClassName="font-normal leading-6"
            >
              Đăng ký
            </Button>
          </View>

          <View className="mt-8">
            <AuthDivider label="hoặc tiếp tục với" />
          </View>

          <AuthGoogleButton
            className="mt-8"
            label="Đăng ký bằng Google"
            loading={pendingAction === "google-register"}
            onPress={() =>
              showUnavailable(
                "google-register",
                "Đăng ký bằng Google hiện chưa khả dụng.",
              )
            }
          />
        </AuthCard>
      </View>

      <Text
        className="mt-6 text-center text-base leading-[26px]"
        style={{ color: authColors.muted, fontFamily: AUTH_FONT_FAMILY }}
      >
        Bằng cách đăng ký, bạn đồng ý với{"\n"}
        <Text
          accessibilityRole="link"
          onPress={() =>
            showUnavailable("terms", "Điều khoản Dịch vụ hiện chưa khả dụng.")
          }
          style={{ color: authColors.primary, fontWeight: "700" }}
        >
          Điều khoản Dịch vụ
        </Text>{" "}
        và{" "}
        <Text
          accessibilityRole="link"
          onPress={() =>
            showUnavailable("privacy", "Chính sách Bảo mật hiện chưa khả dụng.")
          }
          style={{ color: authColors.primary, fontWeight: "700" }}
        >
          Chính sách Bảo mật
        </Text>{" "}
        của Nutelyt.
      </Text>

      <Pressable
        accessibilityLabel="Quay lại màn hình đăng nhập"
        accessibilityRole="link"
        className="mt-6 min-h-11 items-center justify-center"
        onPress={goToLogin}
      >
        <Text
          className="text-center text-base leading-6"
          style={{ color: authColors.muted, fontFamily: AUTH_FONT_FAMILY }}
        >
          Đã có tài khoản?{" "}
          <Text style={{ color: authColors.primary, fontWeight: "700" }}>
            Đăng nhập ngay
          </Text>
        </Text>
      </Pressable>
    </AuthScreenShell>
  );
}
