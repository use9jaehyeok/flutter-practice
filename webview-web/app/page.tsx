'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ProductList from '@/components/product/ProductList';
import { categories } from '@/data/products';
import { useProducts } from '@/store/products';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const { getProductsByCategory } = useProducts();
  const filteredProducts = getProductsByCategory(selectedCategory);

  return (
    <div>
      <Header title="Shop" showBack={false} />

      {/* 카테고리 탭 */}
      <div className="sticky top-11 z-40 bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto hide-scrollbar px-4 py-2 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 */}
      <ProductList products={filteredProducts} />
    </div>
  );
}
