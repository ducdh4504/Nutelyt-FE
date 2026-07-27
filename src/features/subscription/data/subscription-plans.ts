import type { SubscriptionPlan } from '../subscription.types';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    title: 'Gói Cơ Bản',
    price: '0đ',
    period: '/ tháng',
    tagline: 'Dành cho người mới bắt đầu',
    features: ['Lượt tư vấn AI cơ bản', 'Theo dõi dinh dưỡng hàng ngày'],
    isCurrent: true,
  },
  {
    id: 'monthly',
    title: 'Gói Hàng Tháng',
    price: '59.000đ',
    period: '/ tháng',
    tagline: 'Linh hoạt theo từng tháng',
    features: ['Không quảng cáo', 'Tăng số lượt tư vấn AI', 'Phân tích chuyên sâu', 'Ăn uống cá nhân hóa & theo dõi dài hạn'],
  },
  {
    id: 'yearly',
    title: 'Gói Hàng Năm',
    price: '590.000đ',
    period: '/ năm',
    tagline: 'Tiết kiệm 20% so với tháng',
    features: ['Mọi tính năng của gói tháng', 'Ưu tiên cập nhật tính năng mới', 'Hỗ trợ 24/7 trực tiếp'],
    badge: 'TIẾT KIỆM HƠN',
  },
];
