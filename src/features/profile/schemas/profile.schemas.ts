import { z } from 'zod';

import { birthdayValueSchema } from '@/features/health-profile';

export const personalProfileDraftSchema = z.object({
  birthday: birthdayValueSchema,
  fullName: z.string().trim().min(2, 'Vui lòng nhập họ và tên.').max(100, 'Họ và tên quá dài.'),
  gender: z.enum(['Nam', 'Nữ', 'Khác']),
});
