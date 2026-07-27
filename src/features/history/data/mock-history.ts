import type { HistorySection } from "@/features/history/history.types";

export const historySections: HistorySection[] = [
  {
    title: "Hôm nay",
    data: [
      {
        id: "bun-bo-lanh-manh",
        title: "Bún bò lành mạnh",
        status: "Đã xem",
        time: "10:32AM",
        image: require("@assets/images/Food/Bun-bo.png"),
      },
      {
        id: "goi-y-3-mon-giam-can",
        title: "Bữa ăn Việt Nam 3 món",
        status: "Đã xem",
        time: "09:15AM",
        image: require("@assets/images/Food/Bua-an-3-mon.png"),
      },
      {
        id: "uc-ga-nuong-mat-ong",
        title: "Ức gà nướng mật ong",
        status: "Đã lưu",
        time: "08:20AM",
        image: require("@assets/images/Food/Uc-ga-mat-ong.png"),
      },
    ],
  },
  {
    title: "Hôm qua",
    data: [
      {
        id: "com-tam-suon-bi-cha",
        title: "Cơm tấm sườn bì chả",
        status: "Đã xem",
        time: "15:45PM",
        image: require("@assets/images/Food/Com-tam.png"),
      },
      {
        id: "salad-ca-hoi",
        title: "Salad cá hồi",
        status: "Đã xem",
        time: "17:22PM",
        image: require("@assets/images/Food/Salad-ca-hoi.png"),
      },
    ],
  },
  {
    title: "2 ngày trước",
    data: [
      {
        id: "goi-y-mon-an-tap-gym",
        title: "Gợi ý món ăn tập gym",
        status: "Đã xem",
        time: "18:30PM",
        image: require("@assets/images/Food/Mon-an-tap-gym.png"),
      },
    ],
  },
];
