export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = {
  confirmPassword: string;
  email: string;
  fullName: string;
  password: string;
};

export type AuthFieldErrors<T> = Partial<Record<keyof T, string>>;

export type AuthenticationResult =
  | { success: true }
  | { message: string; success: false };
