import type { ImageSource } from "expo-image";
import { z } from "zod";

import type { HistorySection } from "@/features/history/history.types";
import { isImageSource } from "@/utils/image-source";

const historySectionSchema: z.ZodType<HistorySection> = z.object({
  title: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.enum(["Đã xem", "Đã lưu"]),
      time: z.string(),
      image: z.custom<number | ImageSource>(isImageSource, "Invalid image source"),
    }),
  ),
});

export const historySectionsSchema = z.array(historySectionSchema);
