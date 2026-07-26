import type { DashboardChartDay, DashboardFoodEntry, DashboardMacro, DashboardWarning } from '../dashboard.types';

export const dashboardMock = {
  period: '08/06 - 14/06',
  insight:
    'Tuần này bạn nạp carb hơi cao, đạm ổn, rau xanh còn thấp. Hãy bổ sung thêm chất xơ nhé!',
  calories: {
    average: '1,950',
    unit: 'kcal/ngày',
    delta: '+150 vs mục tiêu',
    score: '7/10 tốt',
  },
  macros: [
    { id: 'carb', label: 'Carb', value: '272g', color: '#FBBC04' },
    { id: 'protein', label: 'Protein', value: '85g', color: '#27AE60' },
    { id: 'fat', label: 'Fat', value: '62g', color: '#94F2F7' },
  ] satisfies DashboardMacro[],
  consistency: {
    days: '4/7 ngày',
    label: 'Bạn vượt mục tiêu dinh dưỡng',
    progress: 57,
  },
  warnings: [
    {
      id: 'sodium',
      title: 'Natri cao',
      message: 'Bạn đang tiêu thụ muối/natri cao trong tuần này.',
      tone: 'danger',
    },
    {
      id: 'protein',
      title: 'Đạm cao',
      message: 'Có thể cần cân bằng khẩu phần đạm trong một số bữa ăn.',
      tone: 'warning',
    },
  ] satisfies DashboardWarning[],
  chart: [
    { day: 'T2', carb: 212, protein: 72, fat: 52 },
    { day: 'T3', carb: 260, protein: 80, fat: 58 },
    { day: 'T4', carb: 310, protein: 92, fat: 68 },
    { day: 'T5', carb: 238, protein: 86, fat: 64 },
    { day: 'T6', carb: 285, protein: 84, fat: 76 },
    { day: 'T7', carb: 325, protein: 90, fat: 82 },
    { day: 'CN', carb: 268, protein: 78, fat: 70 },
  ] satisfies DashboardChartDay[],
  chartNote:
    'Bạn nạp nhiều carb hơn đạm trong phần lớn các ngày. Protein khá ổn định, nhưng chất béo tăng vào cuối tuần.',
  foodGroups: [
    { id: 'starch', label: 'Tinh bột', count: 6, icon: 'disc' },
    { id: 'meat', label: 'Thịt', count: 3, icon: 'circle' },
    { id: 'vegetable', label: 'Rau xanh', count: 3, icon: 'leaf' },
    { id: 'fish', label: 'Cá béo', count: 2, icon: 'droplet' },
  ],
  favoriteFoods: ['Cơm tấm', 'Salad cá hồi'],
  diary: [
    {
      id: 'com-tam',
      day: 'T2',
      date: '08/06',
      title: 'Cơm tấm',
      image: require('../../../../assets/images/Food/Com-tam.png'),
      tags: [
        { label: 'Natri cao', tone: 'danger' },
        { label: 'Ít rau', tone: 'neutral' },
        { label: 'Đã xem', tone: 'neutral' },
      ],
      suggestion: 'Gợi ý: Giảm bớt lượng nước mắm.',
    },
    {
      id: 'salad-ca-hoi',
      day: 'T3',
      date: '09/06',
      title: 'Salad cá hồi',
      image: require('../../../../assets/images/Food/Salad-ca-hoi.png'),
      tags: [
        { label: 'An toàn', tone: 'success' },
        { label: 'Béo tốt', tone: 'success' },
      ],
      suggestion: 'Gợi ý: Thêm một phần tinh bột nguyên cám.',
    },
    {
      id: 'bun-bo',
      day: 'T4',
      date: '10/06',
      title: 'Bún bò lành mạnh',
      image: require('../../../../assets/images/Food/Bun-bo.png'),
      tags: [
        { label: 'Natri cao', tone: 'danger' },
        { label: 'Đạm cao', tone: 'danger' },
      ],
      suggestion: 'Gợi ý: Giảm nước dùng mặn và thêm rau.',
    },
  ] satisfies DashboardFoodEntry[],
  aiAdvice:
    'Dựa trên dữ liệu ăn uống tuần này, bạn nên ăn nhiều rau xanh hơn, giảm món chiên và tăng các món hấp/luộc để cân bằng dinh dưỡng.',
  sodiumDetail: {
    title: 'Natri cao',
    subtitle: 'Tổng quan tuần này',
    status: 'Vượt ngưỡng Natri',
    level: 'Nguy cơ cao hơn 40%',
    actual: '3.2g/ngày',
    recommended: '2.0g',
    description:
      'Lượng muối/natri trong 3 ngày qua cao hơn khuyến nghị. Có thể cần lưu ý và cân nhắc chọn món thanh đạm hơn.',
    relatedMeals: [
      {
        id: 'detail-com-tam',
        title: 'Cơm tấm',
        image: require('../../../../assets/images/Food/Com-tam.png'),
        note: 'Nên giảm nước mắm và đồ chua mặn.',
      },
      {
        id: 'detail-bun-bo',
        title: 'Bún bò lành mạnh',
        image: require('../../../../assets/images/Food/Bun-bo.png'),
        note: 'Cân nhắc giảm nước dùng và thêm rau.',
      },
      {
        id: 'detail-salad-ca-hoi',
        title: 'Salad cá hồi',
        image: require('../../../../assets/images/Food/Salad-ca-hoi.png'),
        note: 'Ưu tiên sốt ít muối.',
      },
    ],
    actions: ['Giảm nước chấm, nước dùng mặn', 'Tăng rau xanh trong bữa ăn', 'Ưu tiên món hấp/luộc'],
    summary: [
      { label: 'Calo trung bình', value: '1,850', unit: 'kcal' },
      { label: 'Protein trung bình', value: '65', unit: 'g' },
    ],
  },
};
