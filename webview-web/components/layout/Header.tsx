'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
}

export default function Header({
  title = 'Shop',
  showBack = false,
  showCart = true,
}: HeaderProps) {
  const router = useRouter();
  const { state } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-11 px-4">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 text-gray-700"
              aria-label="뒤로가기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}
        </div>

        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

        <div className="w-10 flex justify-end">
          {showCart && (
            <Link href="/cart" className="relative p-1 -mr-1 text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.86l1.692-7.37a1.125 1.125 0 00-1.095-1.395H6.104M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {state.totalItems > 99 ? '99+' : state.totalItems}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
