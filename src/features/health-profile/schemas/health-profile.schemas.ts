import { z } from 'zod';

const numericText = (requiredMessage: string, invalidMessage: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .refine((value) => Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max, invalidMessage);

export const birthdayValueSchema = z
  .string()
  .min(1, 'Vui lòng chọn ngày sinh.')
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`)), 'Ngày sinh không hợp lệ.')
  .refine((value) => new Date(`${value}T00:00:00`).getTime() < Date.now(), 'Ngày sinh phải ở trong quá khứ.');

export const weightValueSchema = numericText('Vui lòng nhập cân nặng hiện tại.', 'Cân nặng phải từ 25 đến 500 kg.', 25, 500);

export const healthProfileValuesSchema = z.object({
  allergies: z.array(z.string().trim().min(1)).max(20),
  birthday: birthdayValueSchema,
  currentWeight: weightValueSchema,
  diet: z.enum(['standard', 'vegetarian', 'vegan', 'low-carb', 'high-protein', 'other']),
  fullName: z.string().trim().min(2, 'Vui lòng nhập họ và tên.').max(100, 'Họ và tên quá dài.'),
  gender: z.enum(['Nam', 'Nữ', 'Khác']),
  goalSpeed: z.enum(['mild', 'balanced', 'aggressive']),
  height: numericText('Vui lòng nhập chiều cao.', 'Chiều cao phải từ 80 đến 250 cm.', 80, 250),
  targetWeight: weightValueSchema,
});

export const healthProfileStepSchemas = [
  healthProfileValuesSchema.pick({ birthday: true, currentWeight: true, fullName: true, gender: true, height: true }),
  healthProfileValuesSchema.pick({ goalSpeed: true, targetWeight: true }),
  healthProfileValuesSchema.pick({ allergies: true, diet: true }),
  healthProfileValuesSchema,
] as const;

export type HealthProfileSchemaValues = z.infer<typeof healthProfileValuesSchema>;
