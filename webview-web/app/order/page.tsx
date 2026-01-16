'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { OrderInfo } from '@/types';

export default function OrderPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<OrderInfo>>({});

  // 장바구니가 비어있으면 홈으로
  if (state.items.length === 0) {
    return (
      <div>
        <Header title="주문하기" showBack showCart={false} />
        <div className="flex flex-col items-center justify-center h-60 text-gray-500">
          <p className="text-base">주문할 상품이 없습니다</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            쇼핑하러 가기
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof OrderInfo, value: string) => {
    setOrderInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderInfo> = {};

    if (!orderInfo.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    if (!orderInfo.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요';
    } else if (!/^[0-9-]+$/.test(orderInfo.phone)) {
      newErrors.phone = '올바른 연락처를 입력해주세요';
    }
    if (!orderInfo.address.trim()) {
      newErrors.address = '주소를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // 주문 처리 (실제로는 API 호출)
      clearCart();
      router.push('/order/complete');
    }
  };

  return (
    <div className="pb-24">
      <Header title="주문하기" showBack showCart={false} />

      {/* 배송 정보 */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">배송 정보</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={orderInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="받으실 분 이름"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처
            </label>
            <input
              type="tel"
              value={orderInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="010-0000-0000"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소
            </label>
            <input
              type="text"
              value={orderInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="배송 받으실 주소"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* 주문 상품 */}
      <div className="p-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          주문 상품 ({state.totalItems}개)
        </h2>
        <div className="space-y-2">
          {state.items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between text-sm text-gray-600"
            >
              <span className="flex-1 truncate">{item.product.name}</span>
              <span className="ml-2 flex-shrink-0">x {item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 금액 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-700">결제 금액</span>
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(state.totalPrice)}
          </span>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-[600px] mx-auto">
          <Button variant="primary" size="full" onClick={handleSubmit}>
            {formatPrice(state.totalPrice)} 결제하기
          </Button>
        </div>
      </div>
    </div>
  );
}
