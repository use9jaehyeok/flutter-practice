'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { getProductById } from '@/data/products';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = getProductById(params.id as string);

  if (!product) {
    return (
      <div>
        <Header title="상품 상세" showBack />
        <div className="flex items-center justify-center h-60 text-gray-500">
          상품을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="pb-24">
      <Header title={product.name} showBack />

      {/* 상품 이미지 */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 600px) 100vw, 600px"
        />
        {hasDiscount && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <span className="text-sm text-gray-500">{product.category}</span>
        <h1 className="mt-1 text-xl font-bold text-gray-900">{product.name}</h1>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-base text-gray-400 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">상품 설명</h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* 수량 선택 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">수량</span>
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
            />
          </div>
          <div className="mt-3 text-right">
            <span className="text-sm text-gray-500">총 금액: </span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.price * quantity)}
            </span>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-[600px] mx-auto flex gap-3">
          <Button
            variant="outline"
            size="full"
            onClick={handleAddToCart}
            className="flex-1"
          >
            {isAdded ? '담겼습니다!' : '장바구니'}
          </Button>
          <Button
            variant="primary"
            size="full"
            onClick={handleBuyNow}
            className="flex-1"
          >
            바로구매
          </Button>
        </div>
      </div>
    </div>
  );
}
