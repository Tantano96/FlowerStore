'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { dbService } from '@/lib/supabase';
import { Product, ProductCategory } from '@/types';
import { ShoppingBag, Eye, SlidersHorizontal } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

function ProductListContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [allProds, allCats] = await Promise.all([
        dbService.getProducts(),
        dbService.getProductCategories()
      ]);
      
      setCategories(allCats);
      
      // Filter products by category if param present
      if (categoryParam) {
        setProducts(allProds.filter(p => p.product_categories?.slug === categoryParam));
      } else {
        setProducts(allProds);
      }
      setLoading(false);
    }
    loadData();
  }, [categoryParam]);

  const currentCategory = categories.find(c => c.slug === categoryParam);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 space-x-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-600 font-semibold">Sản phẩm</span>
        {currentCategory && (
          <>
            <span>/</span>
            <span className="text-gray-600 font-semibold">{currentCategory.name}</span>
          </>
        )}
      </nav>

      {/* Hero Category Banner/Header */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <h1 className="text-2xl md:text-4xl font-bold font-serif text-gray-950">
            {currentCategory ? currentCategory.name : 'Tất Cả Sản Phẩm'}
          </h1>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            {currentCategory?.description || 'Khám phá trọn bộ sưu tập mỹ phẩm, kem dưỡng, sản phẩm trang điểm chuyên nghiệp, giúp tôn lên vẻ ngoài cuốn hút.'}
          </p>
        </div>
        {currentCategory?.image_url && (
          <img 
            src={currentCategory.image_url} 
            alt={currentCategory.name} 
            className="w-32 h-32 md:w-44 md:h-44 object-cover rounded-2xl shadow-md shrink-0" 
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center border-b border-gray-100 pb-3">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-primary" /> Danh Mục
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/products" 
                  className={`block py-1.5 text-sm transition-colors ${
                    !categoryParam ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Tất cả sản phẩm
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link 
                    href={`/products?category=${cat.slug}`} 
                    className={`block py-1.5 text-sm transition-colors ${
                      categoryParam === cat.slug ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy sản phẩm nào trong danh mục này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => {
                const discPercent = product.compare_at_price 
                  ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) 
                  : 0;
                return (
                  <div key={product.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative">
                    {discPercent > 0 && (
                      <span className="absolute top-3 left-3 bg-[#e63946] text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                        -{discPercent}%
                      </span>
                    )}

                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 z-20">
                        <Link 
                          href={`/products/${product.slug}`} 
                          className="p-2.5 rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white shadow-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          className="p-2.5 rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white shadow-md transition-colors"
                          title="Thêm vào giỏ"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                          {product.product_categories?.name || 'Mỹ Phẩm'}
                        </span>
                        <Link href={`/products/${product.slug}`} className="block text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </Link>
                      </div>
                      <div className="flex items-center space-x-2 pt-3">
                        <span className="text-sm font-bold text-primary">
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                        {product.compare_at_price && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.compare_at_price.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 animate-pulse">Đang tải sản phẩm...</div>}>
      <ProductListContent />
    </Suspense>
  );
}
