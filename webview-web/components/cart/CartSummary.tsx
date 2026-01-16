'use client';

import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
}

export default function CartSummary({
  totalItems,
  totalPrice,
}: CartSummaryProps) {
  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">총 {totalItems}개 상품</span>
        <div>
          <span className="text-sm text-gray-600">합계: </span>
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
