import type { MockRecipe, RecipeId } from '../ai-chat.types';

export const firstMealSuggestionRecipeIds: RecipeId[] = [
  "canh-chua",
  "thit-kho",
  "chom-chom",
];

export const alternateMealSuggestionRecipeIds: RecipeId[] = [
  "canh-kho-qua-nhoi-thit",
  "tom-rim",
  "chuoi",
];

export const mockRecipes: Record<RecipeId, MockRecipe> = {
  "bun-bo": {
    id: "bun-bo",
    name: "Bún bò",
    image: require("@assets/images/Food/Bun-bo.png"),
    chips: ["Giảm muối", "Ít béo", "Tăng rau xanh"],
    assistantIntro:
      "Đây là gợi ý công thức bún bò phù hợp với tình trạng sức khỏe của bạn:",
    previewNutrition: [
      { label: "Calorie", value: "520 kcal" },
      { label: "Protein", value: "28g" },
      { label: "Carb", value: "65g" },
    ],
    summaryNutrition: {
      calories: "520 kcal",
      protein: "28g",
      carb: "65g",
      fat: "15g",
    },
    overview: {
      goodPoints: [
        "Giàu protein từ nạc",
        "Bổ sung chất sắt, kẽm",
        "Có rau thơm, hỗ trợ tiêu hóa",
      ],
      notes: ["Nước dùng nhiều muối", "Bún chứa nhiều tinh bột"],
    },
    ingredients: [
      {
        title: "Thịt",
        items: ["Bắp bò ............ 500g", "Giò heo ............ 300g"],
      },
      {
        title: "Nước dùng",
        items: [
          "Xương bò ............ 1.5kg",
          "Sả ............ 3 cây",
          "Hành tây ............ 1 củ",
          "Gừng ............ 1 củ",
        ],
      },
      {
        title: "Gia vị",
        items: [
          "Mắm ruốc ............ 2 muỗng",
          "Muối ............ 1 thìa",
          "Đường ............ 2 muỗng",
          "Hạt nêm ............ 1 thìa",
          "Sa tế ............ Tùy chọn",
        ],
      },
      {
        title: "Ăn kèm",
        items: ["Bún tươi ............ 500g", "Rau sống", "Giá đỗ", "Hành lá, ngò rí", "Chanh, ớt"],
      },
    ],
    steps: [
      "Sơ chế: Chần bắp bò và giò heo, rửa sạch. Đập dập sả, nướng gừng và hành.",
      "Nấu nước dùng: Hầm xương hoặc bắp bò, giò heo cùng sả, gừng, hành khoảng 1,5-2 giờ.",
      "Nêm gia vị: Hòa mắm ruốc, lọc lấy nước, cho vào nồi. Nêm muối, đường phèn, hạt nêm vừa ăn.",
      "Chuẩn bị tô: Trụng bún, xếp thịt bò, giò heo vào tô.",
      "Hoàn thành: Chan nước dùng nóng, thêm hành, ngò, ăn kèm rau sống, chanh và sa tế.",
    ],
    nutritionRows: [
      { component: "Năng lượng", amount: "520 kcal", value: "26%" },
      { component: "Carbohydrate", amount: "65 g", value: "22%" },
      { component: "Protein", amount: "28 g", value: "56%" },
      { component: "Chất béo", amount: "16 g", value: "30%" },
      { component: "Chất xơ", amount: "6 g", value: "12%" },
      { component: "Đường", amount: "6 g", value: "4%" },
      { component: "Natri", amount: "1250 mg", value: "54%" },
    ],
  },
  "canh-chua": {
    id: "canh-chua",
    name: "Canh chua",
    image: require("@assets/images/Food/Canh-chua.png"),
    chips: ["Thanh nhẹ", "Nhiều rau", "Dễ ăn"],
    assistantIntro: "Canh chua giúp bữa cơm cân bằng vị chua nhẹ và rau củ.",
    previewNutrition: [
      { label: "Calorie", value: "180 kcal" },
      { label: "Protein", value: "16g" },
      { label: "Carb", value: "18g" },
    ],
    summaryNutrition: {
      calories: "180 kcal",
      protein: "16g",
      carb: "18g",
      fat: "5g",
    },
    overview: {
      goodPoints: [
        "Có nhiều rau như cà chua, bạc hà và giá",
        "Vị chua nhẹ giúp món ăn dễ dùng trong bữa cơm",
        "Có thể bổ sung đạm từ cá hoặc tôm",
      ],
      notes: [
        "Nên nêm vừa phải để kiểm soát lượng muối",
        "Người nhạy cảm với vị chua nên dùng khẩu phần nhỏ",
      ],
    },
    ingredients: [
      {
        title: "Nguyên liệu chính",
        items: ["Cá hoặc tôm ............ 250g", "Cà chua ............ 2 quả", "Dứa ............ 1/4 quả"],
      },
      {
        title: "Rau",
        items: ["Bạc hà", "Đậu bắp", "Giá đỗ", "Rau om, ngò gai"],
      },
      {
        title: "Gia vị",
        items: ["Nước mắm", "Me chua", "Đường", "Muối vừa đủ"],
      },
      {
        title: "Ăn kèm",
        items: ["Cơm trắng", "Ớt tươi tùy chọn"],
      },
    ],
    steps: [
      "Sơ chế: Rửa sạch cá hoặc tôm, cắt rau thành miếng vừa ăn.",
      "Nấu nền chua: Đun nước, cho me và cà chua vào tạo vị chua nhẹ.",
      "Thêm đạm: Cho cá hoặc tôm vào nấu chín, vớt bọt nếu cần.",
      "Thêm rau: Cho dứa, bạc hà, đậu bắp và giá vào, nấu vừa chín tới.",
      "Hoàn thành: Nêm vừa ăn, thêm rau om và ngò gai trước khi dùng.",
    ],
    nutritionRows: [
      { component: "Năng lượng", amount: "180 kcal", value: "9%" },
      { component: "Carbohydrate", amount: "18 g", value: "6%" },
      { component: "Protein", amount: "16 g", value: "32%" },
      { component: "Chất béo", amount: "5 g", value: "8%" },
      { component: "Chất xơ", amount: "4 g", value: "16%" },
      { component: "Đường", amount: "8 g", value: "6%" },
      { component: "Natri", amount: "520 mg", value: "23%" },
    ],
  },
  "thit-kho": {
    id: "thit-kho",
    name: "Thịt kho",
    image: require("@assets/images/Food/Thit-kho.png"),
    chips: ["Đậm đà", "Giàu đạm", "Ăn cùng cơm"],
    assistantIntro: "Thịt kho là món mặn chính quen thuộc trong bữa cơm Việt.",
    previewNutrition: [
      { label: "Calorie", value: "360 kcal" },
      { label: "Protein", value: "24g" },
      { label: "Carb", value: "10g" },
    ],
    summaryNutrition: {
      calories: "360 kcal",
      protein: "24g",
      carb: "10g",
      fat: "24g",
    },
    overview: {
      goodPoints: [
        "Cung cấp đạm cho bữa ăn chính",
        "Dễ kết hợp với cơm và món canh",
        "Có thể chọn phần thịt nạc hơn để giảm chất béo",
      ],
      notes: [
        "Nên kiểm soát lượng đường và nước mắm khi kho",
        "Khẩu phần vừa phải giúp bữa ăn cân bằng hơn",
      ],
    },
    ingredients: [
      {
        title: "Thịt",
        items: ["Thịt heo ............ 350g", "Trứng luộc tùy chọn ............ 2 quả"],
      },
      {
        title: "Gia vị kho",
        items: ["Nước mắm", "Nước màu", "Hành tím", "Tiêu", "Đường vừa đủ"],
      },
      {
        title: "Nước kho",
        items: ["Nước lọc hoặc nước dừa", "Ớt tùy chọn"],
      },
      {
        title: "Ăn kèm",
        items: ["Cơm trắng", "Dưa leo hoặc rau luộc"],
      },
    ],
    steps: [
      "Sơ chế: Cắt thịt miếng vừa ăn, ướp với hành tím, nước mắm, tiêu và ít đường.",
      "Áp chảo: Đảo thịt săn lại để giữ vị ngọt.",
      "Kho: Thêm nước lọc hoặc nước dừa, kho nhỏ lửa đến khi thịt mềm.",
      "Thêm trứng: Nếu dùng trứng, cho vào nồi ở giai đoạn giữa để thấm vị.",
      "Hoàn thành: Nêm lại vừa ăn, dùng cùng cơm và rau để cân bằng bữa ăn.",
    ],
    nutritionRows: [
      { component: "Năng lượng", amount: "360 kcal", value: "18%" },
      { component: "Carbohydrate", amount: "10 g", value: "3%" },
      { component: "Protein", amount: "24 g", value: "48%" },
      { component: "Chất béo", amount: "24 g", value: "37%" },
      { component: "Chất xơ", amount: "1 g", value: "4%" },
      { component: "Đường", amount: "7 g", value: "5%" },
      { component: "Natri", amount: "780 mg", value: "34%" },
    ],
  },
  "chom-chom": {
    id: "chom-chom",
    name: "Chôm chôm",
    image: require("@assets/images/Food/Chom-chom.png"),
    chips: ["Tráng miệng", "Khẩu phần nhỏ", "Trái cây"],
    assistantIntro: "Chôm chôm dùng như món trái cây tráng miệng sau bữa cơm.",
    previewNutrition: [
      { label: "Calorie", value: "95 kcal" },
      { label: "Protein", value: "1g" },
      { label: "Carb", value: "23g" },
    ],
    summaryNutrition: {
      calories: "95 kcal",
      protein: "1g",
      carb: "23g",
      fat: "0g",
    },
    overview: {
      goodPoints: [
        "Phù hợp làm món tráng miệng với khẩu phần vừa phải",
        "Cung cấp nước và vị ngọt tự nhiên",
        "Dễ chuẩn bị, không cần chế biến phức tạp",
      ],
      notes: [
        "Có đường tự nhiên nên nên chia khẩu phần hợp lý",
        "Không nên ăn hạt chôm chôm",
      ],
    },
    ingredients: [
      {
        title: "Trái cây",
        items: ["Chôm chôm tươi ............ 8-10 quả"],
      },
      {
        title: "Sơ chế",
        items: ["Nước sạch để rửa", "Rổ để ráo"],
      },
      {
        title: "Khẩu phần",
        items: ["1 phần nhỏ sau bữa ăn", "Có thể dùng mát"],
      },
      {
        title: "Lưu ý",
        items: ["Bỏ vỏ", "Không ăn hạt"],
      },
    ],
    steps: [
      "Rửa: Rửa chôm chôm dưới vòi nước sạch.",
      "Để ráo: Cho vào rổ và để ráo nước.",
      "Tách vỏ: Dùng tay bóc vỏ nhẹ nhàng trước khi ăn.",
      "Bỏ hạt: Tách phần thịt quả, tránh cắn hoặc ăn hạt.",
      "Phục vụ: Chia thành khẩu phần nhỏ và dùng như món tráng miệng.",
    ],
    nutritionRows: [
      { component: "Năng lượng", amount: "95 kcal", value: "5%" },
      { component: "Carbohydrate", amount: "23 g", value: "8%" },
      { component: "Protein", amount: "1 g", value: "2%" },
      { component: "Chất béo", amount: "0 g", value: "0%" },
      { component: "Chất xơ", amount: "2 g", value: "8%" },
      { component: "Đường", amount: "18 g", value: "12%" },
      { component: "Natri", amount: "5 mg", value: "0%" },
    ],
  },
  "canh-kho-qua-nhoi-thit": {
    id: "canh-kho-qua-nhoi-thit",
    name: "Canh khổ qua nhồi thịt",
    image: require("@assets/images/Food/Canh-kho-qua.png"),
    chips: ["Thanh nhẹ", "Có rau", "Đạm vừa"],
    assistantIntro:
      "Canh khổ qua nhồi thịt là món canh ấm, có rau và phần nhân đạm vừa phải.",
    previewNutrition: [
      { label: "Calorie", value: "220 kcal" },
      { label: "Protein", value: "18g" },
      { label: "Carb", value: "12g" },
    ],
    summaryNutrition: {
      calories: "220 kcal",
      protein: "18g",
      carb: "12g",
      fat: "10g",
    },
    overview: {
      goodPoints: [
        "Kết hợp khổ qua với phần nhân thịt để cân bằng rau và đạm",
        "Phù hợp làm món canh trong bữa cơm gia đình Việt",
        "Nước canh ấm và khẩu phần vừa phải giúp bữa ăn dễ dùng hơn",
      ],
      notes: [
        "Nên nêm nước dùng vừa phải để kiểm soát lượng natri",
        "Vị đắng của khổ qua có thể không phù hợp với mọi người",
      ],
    },
    ingredients: [
      {
        title: "Khổ qua và nhân",
        items: [
          "Khổ qua ............ 2 trái",
          "Thịt heo xay ............ 220g",
          "Nấm mèo băm ............ 2 tai",
          "Hành tím băm ............ 1 muỗng",
        ],
      },
      {
        title: "Nước dùng",
        items: ["Nước dùng hoặc nước lọc ............ 900ml", "Hành lá", "Ngò rí"],
      },
      {
        title: "Gia vị",
        items: ["Nước mắm vừa đủ", "Tiêu", "Hạt nêm", "Một ít muối"],
      },
      {
        title: "Ăn kèm",
        items: ["Cơm trắng", "Rau thơm tùy chọn"],
      },
    ],
    steps: [
      "Sơ chế: Rửa khổ qua, cắt khúc, bỏ ruột và ngâm nước muối loãng trong vài phút.",
      "Làm nhân: Trộn thịt xay với nấm mèo, hành tím, tiêu và một ít gia vị.",
      "Nhồi khổ qua: Cho nhân vào từng khoanh khổ qua, nén nhẹ để nhân không rơi ra.",
      "Nấu canh: Đun nước dùng, cho khổ qua nhồi thịt vào nấu lửa vừa.",
      "Hoàn thành: Hầm đến khi khổ qua mềm và nhân chín, nêm vừa ăn, thêm hành ngò rồi dùng nóng.",
    ],
    nutritionRows: [
      { component: "Năng lượng", amount: "220 kcal", value: "11%" },
      { component: "Carbohydrate", amount: "12 g", value: "4%" },
      { component: "Protein", amount: "18 g", value: "36%" },
      { component: "Chất béo", amount: "10 g", value: "15%" },
      { component: "Chất xơ", amount: "4 g", value: "16%" },
      { component: "Đường", amount: "3 g", value: "2%" },
      { component: "Natri", amount: "610 mg", value: "27%" },
    ],
  },
  "tom-rim": {
    id: "tom-rim",
    name: "Tôm rim",
    image: require("@assets/images/Food/Tom-rim.png"),
    chips: ["Giàu đạm", "Đậm vị", "Ăn với cơm"],
    assistantIntro:
      "Tôm rim là món mặn giàu đạm, phù hợp dùng như món chính trong bữa cơm.",
    previewNutrition: [
      { label: "Calorie", value: "260 kcal" },
      { label: "Protein", value: "26g" },
      { label: "Carb", value: "9g" },
    ],
    summaryNutrition: {
      calories: "260 kcal",
      protein: "26g",
      carb: "9g",
      fat: "12g",
    },
    overview: {
      goodPoints: [
        "Cung cấp đạm từ tôm cho món mặn chính",
        "Hương vị đậm đà, dễ kết hợp với cơm và món canh",
        "Có thể chia khẩu phần nhỏ để bữa ăn cân bằng hơn",
      ],
      notes: [
        "Nước mắm và gia vị rim có thể làm món ăn nhiều natri",
        "Nên dùng lượng đường vừa phải khi làm sốt rim",
      ],
    },
    ingredients: [
      {
        title: "Tôm",
        items: ["Tôm tươi ............ 300g", "Nước muối loãng để rửa"],
      },
      {
        title: "Nước sốt",
        items: ["Nước mắm", "Một ít đường", "Tiêu", "Nước lọc"],
      },
      {
        title: "Gia vị và rau thơm",
        items: ["Tỏi băm", "Hành tím băm", "Hành lá", "Dầu ăn"],
      },
      {
        title: "Ăn kèm",
        items: ["Cơm trắng", "Dưa leo hoặc rau luộc"],
      },
    ],
    steps: [
      "Sơ chế: Rửa tôm, cắt râu, để ráo và ướp nhẹ với tiêu.",
      "Phi thơm: Làm nóng ít dầu, phi tỏi và hành tím đến khi thơm.",
      "Rim tôm: Cho tôm vào đảo nhanh đến khi săn lại.",
      "Thêm sốt: Cho nước mắm, ít đường và nước lọc vào, rim lửa nhỏ.",
      "Hoàn thành: Khi sốt áo đều tôm, tắt bếp, thêm tiêu và hành lá rồi dùng với cơm.",
    ],
    nutritionRows: [
      { component: "Năng lượng", amount: "260 kcal", value: "13%" },
      { component: "Carbohydrate", amount: "9 g", value: "3%" },
      { component: "Protein", amount: "26 g", value: "52%" },
      { component: "Chất béo", amount: "12 g", value: "18%" },
      { component: "Chất xơ", amount: "1 g", value: "4%" },
      { component: "Đường", amount: "6 g", value: "4%" },
      { component: "Natri", amount: "720 mg", value: "31%" },
    ],
  },
  chuoi: {
    id: "chuoi",
    name: "Chuối",
    image: require("@assets/images/Food/Chuoi.png"),
    chips: ["Tráng miệng", "Khẩu phần nhỏ", "Trái cây"],
    assistantIntro:
      "Chuối là món trái cây tráng miệng đơn giản, tiện dùng sau bữa cơm.",
    previewNutrition: [
      { label: "Calorie", value: "105 kcal" },
      { label: "Protein", value: "1g" },
      { label: "Carb", value: "27g" },
    ],
    summaryNutrition: {
      calories: "105 kcal",
      protein: "1g",
      carb: "27g",
      fat: "0g",
    },
    overview: {
      goodPoints: [
        "Dễ dùng như món tráng miệng sau bữa ăn",
        "Có vị ngọt tự nhiên và chuẩn bị rất nhanh",
        "Thuận tiện chia thành khẩu phần nhỏ",
      ],
      notes: [
        "Giá trị dinh dưỡng thay đổi tùy kích thước quả",
        "Nên dùng khẩu phần vừa phải vì chuối có vị ngọt tự nhiên",
      ],
    },
    ingredients: [
      {
        title: "Trái cây",
        items: ["Chuối chín vừa ............ 1 quả"],
      },
      {
        title: "Sơ chế",
        items: ["Nước sạch để rửa vỏ trước khi cầm nắm", "Dao nhỏ nếu muốn cắt lát"],
      },
      {
        title: "Khẩu phần",
        items: ["1 quả nhỏ hoặc 1/2 quả lớn", "Dùng sau bữa ăn"],
      },
      {
        title: "Ăn kèm",
        items: ["Nước lọc", "Có thể dùng mát tùy thích"],
      },
    ],
    steps: [
      "Chọn quả: Chọn chuối chín vừa, vỏ không dập nhiều.",
      "Rửa vỏ: Rửa nhẹ phần vỏ trước khi cầm nắm và bóc.",
      "Bóc vỏ: Bóc chuối ngay trước khi ăn để giữ độ tươi.",
      "Chia phần: Cắt lát hoặc chia thành khẩu phần nhỏ nếu cần.",
      "Phục vụ: Dùng sau bữa ăn như món trái cây tráng miệng.",
    ],
    nutritionRows: [
      { component: "Năng lượng", amount: "105 kcal", value: "5%" },
      { component: "Carbohydrate", amount: "27 g", value: "9%" },
      { component: "Protein", amount: "1 g", value: "2%" },
      { component: "Chất béo", amount: "0 g", value: "0%" },
      { component: "Chất xơ", amount: "3 g", value: "12%" },
      { component: "Đường", amount: "14 g", value: "9%" },
      { component: "Natri", amount: "1 mg", value: "0%" },
    ],
  },
};

export function getMockRecipe(recipeId: RecipeId | null | undefined) {
  return recipeId ? mockRecipes[recipeId] : undefined;
}
