import { colors } from '@/src/constants/tokens';

import type { HealthOption } from '../types';

const brand = colors.primaryDark;

export const purposes: HealthOption[] = [
  {
    id: 'chronic',
    label: 'Người bệnh mạn tính',
    description:
      'Khó chọn món ăn phù hợp với tình trạng sức khỏe và các thành phần cần kiểm soát.',
    icon: 'activity',
    tone: brand,
  },
  {
    id: 'personal',
    label: 'Người quan tâm sức khỏe cá nhân',
    description:
      'Khó xác định món ăn phù hợp với mục tiêu giảm cân, tăng cơ, ăn lành mạnh, cải thiện vóc dáng hoặc ăn theo chế độ.',
    icon: 'user',
    tone: '#006492',
  },
  {
    id: 'family',
    label: 'Người quan tâm sức khỏe gia đình',
    description:
      'Khó lựa chọn và điều chỉnh bữa ăn phù hợp cho nhiều thành viên có nhu cầu dinh dưỡng khác nhau, đồng thời phải cân đối chi phí sinh hoạt hằng ngày.',
    icon: 'users',
    tone: '#904D00',
  },
];

export const conditions: HealthOption[] = [
  { id: 'diabetes', label: 'Tiểu đường', icon: 'droplet', tone: brand },
  { id: 'pressure', label: 'Tăng huyết áp', icon: 'trending-up', tone: '#006492' },
  { id: 'heart', label: 'Bệnh tim mạch', icon: 'heart', tone: '#904D00' },
  { id: 'fat', label: 'Rối loạn mỡ máu', icon: 'bar-chart-2', tone: brand },
  { id: 'kidney', label: 'Bệnh thận', icon: 'shield', tone: '#006492' },
  { id: 'stomach', label: 'Bệnh dạ dày', icon: 'coffee', tone: '#904D00' },
];

export const goals: HealthOption[] = [
  {
    id: 'loss',
    label: 'Giảm cân',
    description:
      'Duy trì mức thâm hụt calo phù hợp để hỗ trợ giảm cân, đồng thời đảm bảo cân bằng dinh dưỡng.',
    icon: 'trending-down',
    tone: brand,
  },
  {
    id: 'maintain',
    label: 'Duy trì sức khỏe',
    description:
      'Hỗ trợ duy trì cân nặng hiện tại đồng thời cải thiện các chỉ số sức khỏe tổng quát.',
    icon: 'heart',
    tone: '#006492',
  },
  {
    id: 'muscle',
    label: 'Tăng cơ',
    description:
      'Ưu tiên lượng protein cao kết hợp với mức calo dư phù hợp nhằm hỗ trợ tăng khối lượng cơ và cải thiện sức mạnh.',
    icon: 'zap',
    tone: '#904D00',
  },
  {
    id: 'gain',
    label: 'Tăng cân',
    description:
      'Điều chỉnh lượng calo mục tiêu nhằm hỗ trợ tăng cân an toàn, đồng thời đảm bảo cân bằng dinh dưỡng.',
    icon: 'trending-up',
    tone: brand,
  },
];

export const diets: HealthOption[] = [
  {
    id: 'keto',
    label: 'Keto',
    description: 'Ít tinh bột, nhiều chất béo',
    icon: 'coffee',
    tone: brand,
  },
  {
    id: 'low-carb',
    label: 'Giảm tinh bột',
    description: 'Giảm đường và tinh bột.',
    icon: 'sliders',
    tone: '#006492',
  },
  {
    id: 'vegan',
    label: 'Chay',
    description: 'Chế độ ăn thuần thực vật',
    icon: 'sun',
    tone: brand,
  },
  {
    id: 'bulking',
    label: 'Tăng cơ',
    description: 'Cung cấp calo dư để phát triển cơ bắp',
    icon: 'zap',
    tone: '#904D00',
  },
  {
    id: 'cutting',
    label: 'Giảm mỡ',
    description: 'Thâm hụt calo để giảm mỡ cơ thể',
    icon: 'trending-down',
    tone: '#006492',
  },
];