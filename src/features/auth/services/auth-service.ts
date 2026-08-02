import type {
  AuthenticationResult,
  LoginValues,
  RegisterValues,
} from "../auth.types";

const DEMO_ACCOUNT = {
  email: "admin@gmail.com",
  password: "Test@123",
} as const;

export async function authenticateWithCurrentContract(
  values: LoginValues,
): Promise<AuthenticationResult> {
  if (
    values.email === DEMO_ACCOUNT.email &&
    values.password === DEMO_ACCOUNT.password
  ) {
    return { success: true };
  }

  return {
    message: "Email hoặc mật khẩu không đúng.",
    success: false,
  };
}

export async function registerWithCurrentContract(
  _values: RegisterValues,
): Promise<AuthenticationResult> {
  return {
    message: "Đăng ký tài khoản hiện chưa khả dụng.",
    success: false,
  };
}
