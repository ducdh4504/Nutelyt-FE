import type { ImageSource } from "expo-image";

export function isImageSource(value: unknown): value is number | ImageSource {
  return typeof value === "number" || (typeof value === "object" && value !== null);
}
