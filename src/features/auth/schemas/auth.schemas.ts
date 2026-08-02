import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email.")
    .email("Email chưa đúng định dạng."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export const registerSchema = z
  .object({
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập email.")
      .email("Email chưa đúng định dạng."),
    fullName: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập họ và tên.")
      .min(2, "Họ và tên cần có ít nhất 2 ký tự."),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu.")
      .min(8, "Mật khẩu cần có ít nhất 8 ký tự."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Mật khẩu xác nhận chưa khớp.",
    path: ["confirmPassword"],
  });
