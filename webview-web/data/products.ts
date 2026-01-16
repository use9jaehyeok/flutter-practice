import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: '프리미엄 무선 이어폰',
    price: 89000,
    originalPrice: 129000,
    image: 'https://picsum.photos/seed/earphone/400/400',
    description: '고품질 사운드와 노이즈 캔슬링 기능을 갖춘 무선 이어폰입니다. 최대 24시간 재생 가능.',
    category: '전자기기',
  },
  {
    id: '2',
    name: '캐주얼 반팔 티셔츠',
    price: 29000,
    image: 'https://picsum.photos/seed/tshirt/400/400',
    description: '부드러운 면 소재의 데일리 티셔츠입니다. 다양한 색상으로 제공됩니다.',
    category: '의류',
  },
  {
    id: '3',
    name: '스테인리스 텀블러 500ml',
    price: 25000,
    originalPrice: 35000,
    image: 'https://picsum.photos/seed/tumbler/400/400',
    description: '보온/보냉 기능의 스테인리스 텀블러입니다. 12시간 보온, 24시간 보냉.',
    category: '생활용품',
  },
  {
    id: '4',
    name: '가죽 크로스백',
    price: 79000,
    image: 'https://picsum.photos/seed/bag/400/400',
    description: '심플한 디자인의 가죽 크로스백입니다. 수납공간이 넉넉합니다.',
    category: '패션잡화',
  },
  {
    id: '5',
    name: '무선 충전기',
    price: 35000,
    originalPrice: 45000,
    image: 'https://picsum.photos/seed/charger/400/400',
    description: '15W 고속 무선 충전을 지원하는 충전 패드입니다. LED 인디케이터 포함.',
    category: '전자기기',
  },
  {
    id: '6',
    name: '아로마 디퓨저',
    price: 42000,
    image: 'https://picsum.photos/seed/diffuser/400/400',
    description: '은은한 향기와 무드등 기능의 디퓨저입니다. 7가지 LED 색상 변환.',
    category: '생활용품',
  },
];

export const categories = ['전체', '전자기기', '의류', '생활용품', '패션잡화'];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === '전체') return products;
  return products.filter((product) => product.category === category);
}
