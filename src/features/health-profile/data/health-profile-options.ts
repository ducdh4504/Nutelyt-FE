import { colors } from '@/src/constants/tokens';

import type { HealthOption } from '../types';

const brand = colors.primaryDark;

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
    description: 'Hỗ trợ duy trì cân nặng hiện tại đồng thời cải thiện các chỉ số sức khỏe tổng quát.',
    icon: 'heart',
    tone: '#006492',
  },
  {
    id: 'muscle',
    label: 'Tăng cơ',
    description:
      'Ưu tiên lượng protein cao kết hợp với mức calo dư phù hợp nhằm hỗ trợ tăng khối lượng cơ và cải thiện sức mạnh.',
    icon: 'activity',
    tone: '#904D00',
  },
  {
    id: 'gain',
    label: 'Tăng cân',
    description:
      'Điều chỉnh lượng calo mục tiêu nhằm hỗ trợ tăng cân an toàn, đồng thời đảm bảo cân bằng dinh dưỡng.',
    icon: 'trending-up',
    tone: '#5A6B5E',
  },
];

export const diets: HealthOption[] = [
  {
    id: 'keto',
    label: 'Keto',
    description: 'Ít tinh bột, nhiều chất béo',
    icon: 'droplet',
    tone: brand,
  },
  {
    id: 'low-carb',
    label: 'Giảm tinh bột',
    description: 'Giảm đường và tinh bột.',
    icon: 'coffee',
    tone: '#006492',
  },
  {
    id: 'vegan',
    label: 'Chay',
    description: 'Chế độ ăn thuần thực vật',
    icon: 'feather',
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
    tone: '#C02828',
  },
];

export const conditions: HealthOption[] = [
  { id: 'diabetes', label: 'Tiểu đường', icon: 'shield', tone: brand },
  { id: 'pressure', label: 'Tăng huyết áp', icon: 'activity', tone: '#006492' },
  { id: 'heart', label: 'Bệnh tim mạch', icon: 'heart', tone: '#006D37' },
  { id: 'fat', label: 'Rối loạn mỡ máu', icon: 'droplet', tone: brand },
  { id: 'kidney', label: 'Bệnh thận', icon: 'git-branch', tone: '#006492' },
  { id: 'stomach', label: 'Bệnh dạ dày', icon: 'coffee', tone: '#904D00' },
];