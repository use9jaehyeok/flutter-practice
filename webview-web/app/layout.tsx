import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/store/cart';
import { ProductProvider } from '@/store/products';
import BottomNav from '@/components/layout/BottomNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '모바일 쇼핑몰',
  description: '모바일 쇼핑몰 MVP',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProductProvider>
          <CartProvider>
            <div className="mobile-container">
              <main className="pb-14">{children}</main>
              <BottomNav />
            </div>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
