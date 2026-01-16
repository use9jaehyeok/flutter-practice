'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '@/components/ui/QuantitySelector';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const { product, quantity } = item;

  return (
    <div className="flex gap-3 p-4 bg-white border-b border-gray-100">
      {/* 상품 이미지 */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <button
            onClick={onRemove}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
            aria-label="삭제"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mt-1 text-base font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={onQuantityChange}
          />
          <span className="text-sm font-medium text-blue-600">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
