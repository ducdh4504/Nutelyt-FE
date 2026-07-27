import type { ImageSource } from "expo-image";

export type HistoryStatus = "Đã xem" | "Đã lưu";

export type HistoryItem = {
  id: string;
  title: string;
  status: HistoryStatus;
  time: string;
  image: number | ImageSource;
};

export type HistorySection = {
  title: string;
  data: HistoryItem[];
};
