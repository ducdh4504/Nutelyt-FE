export type OnboardingStep = {
  description: string;
  id: 'scan' | 'analyze' | 'personalized';
  primaryLabel: string;
  secondaryLabel?: string;
  title: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'scan',
    title: 'Quét mọi sản phẩm thực phẩm\ntrong vài giây',
    description:
      'Nhận ngay thông tin dinh dưỡng và các cảnh báo sức khỏe chỉ bằng cách hướng camera vào bất kỳ nhãn thực phẩm nào.',
    primaryLabel: 'Tiếp tục',
    secondaryLabel: 'Tìm hiểu thêm về Nutelyt',
  },
  {
    id: 'analyze',
    title: 'AI phân tích thành phần\nvà giá trị dinh dưỡng',
    description:
      'AI phân tích các nhãn thực phẩm phức tạp và chuyển chúng thành những gợi ý sức khỏe dễ hiểu, phù hợp với riêng bạn.',
    primaryLabel: 'Tiếp tục',
  },
  {
    id: 'personalized',
    title: 'Nhận gợi ý sức khỏe phù hợp\nvới riêng bạn.',
    description:
      'Nhận thông tin và khuyến nghị được cá nhân hóa theo nhu cầu dinh dưỡng, mục tiêu sức khỏe và lối sống của bạn.',
    primaryLabel: 'Bắt đầu ngay',
  },
];
