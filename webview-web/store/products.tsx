'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from 'react';
import { Product } from '@/types';
import { products as initialProducts } from '@/data/products';

type ProductAction =
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'REMOVE_PRODUCT'; productId: string };

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  removeProduct: (productId: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

const ProductContext = createContext<ProductContextType | null>(null);

function productReducer(state: Product[], action: ProductAction): Product[] {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return [action.product, ...state];

    case 'REMOVE_PRODUCT':
      return state.filter((product) => product.id !== action.productId);

    default:
      return state;
  }
}

function generateId(): string {
  return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, dispatch] = useReducer(productReducer, initialProducts);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
    };
    dispatch({ type: 'ADD_PRODUCT', product: newProduct });
  };

  const removeProduct = (productId: string) => {
    dispatch({ type: 'REMOVE_PRODUCT', productId });
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((product) => product.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    if (category === '전체') return products;
    return products.filter((product) => product.category === category);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        getProductById,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
