'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { useProducts } from '@/store/products';
import { formatPrice } from '@/lib/utils';

interface FormData {
  name: string;
  image: string;
  price: string;
}

interface FormErrors {
  name?: string;
  image?: string;
  price?: string;
}

export default function ProductNewPage() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    image: '',
    price: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePriceChange = (value: string) => {
    // 숫자만 허용
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange('price', numericValue);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '상품명을 입력해주세요';
    }
    if (!formData.image) {
      newErrors.image = '상품 이미지를 선택해주세요';
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      newErrors.price = '올바른 가격을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addProduct({
        name: formData.name.trim(),
        image: formData.image,
        price: parseInt(formData.price),
        description: `${formData.name.trim()} 상품입니다.`,
        category: '전체',
      });
      router.push('/');
    }
  };

  const priceNumber = parseInt(formData.price) || 0;

  return (
    <div className="pb-24">
      <Header title="상품 등록" showBack showCart={false} />

      <div className="p-4 space-y-6">
        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 이미지
          </label>
          <ImageUpload
            value={formData.image}
            onChange={(url) => handleInputChange('image', url)}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
        </div>

        {/* 상품명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품명
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="상품명을 입력하세요"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* 가격 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            가격
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={formData.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0"
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              원
            </span>
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
          {priceNumber > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {formatPrice(priceNumber)}
            </p>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-[600px] mx-auto">
          <Button variant="primary" size="full" onClick={handleSubmit}>
            상품 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
