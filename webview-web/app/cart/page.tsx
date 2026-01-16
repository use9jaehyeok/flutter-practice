'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Button from '@/components/ui/Button';
import { useCart } from '@/store/cart';

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart();

  return (
    <div className="pb-36">
      <Header title="장바구니" showBack showCart={false} />

      {state.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mb-4 text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.86l1.692-7.37a1.125 1.125 0 00-1.095-1.395H6.104M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <p className="text-base">장바구니가 비어있습니다</p>
          <Link
            href="/"
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <>
          {/* 장바구니 아이템 목록 */}
          <div>
            {state.items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onQuantityChange={(quantity) =>
                  updateQuantity(item.product.id, quantity)
                }
                onRemove={() => removeItem(item.product.id)}
              />
            ))}
          </div>

          {/* 요약 */}
          <CartSummary
            totalItems={state.totalItems}
            totalPrice={state.totalPrice}
          />

          {/* 하단 고정 버튼 */}
          <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-[600px] mx-auto">
              <Link href="/order">
                <Button variant="primary" size="full">
                  주문하기 ({state.totalItems}개)
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
