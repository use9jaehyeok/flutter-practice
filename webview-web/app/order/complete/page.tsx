'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

export default function OrderCompletePage() {
  return (
    <div>
      <Header title="주문 완료" showBack={false} showCart={false} />

      <div className="flex flex-col items-center justify-center px-4 py-16">
        {/* 체크 아이콘 */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-10 h-10 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          주문이 완료되었습니다!
        </h1>
        <p className="text-gray-500 text-center mb-8">
          주문해 주셔서 감사합니다.
          <br />
          빠른 시일 내에 배송해 드리겠습니다.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link href="/">
            <Button variant="primary" size="full">
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
