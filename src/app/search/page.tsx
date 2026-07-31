'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { dbService } from '@/lib/supabase';
import { Product, Post } from '@/types';
import { Search, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

function SearchContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      const [matchedProds, matchedPosts] = await Promise.all([
        dbService.getProducts({ search: query }),
        dbService.getPosts({ search: query })
      ]);
      setProducts(matchedProds);
      setPosts(matchedPosts);
      setLoading(false);
    }
    if (query) {
      performSearch();
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-950 flex items-center justify-center">
          <Search className="w-6 h-6 mr-2 text-primary" /> Kết Quả Tìm Kiếm
        </h1>
        <p className="text-sm text-gray-500 font-light">Tìm thấy kết quả cho từ khóa: <span className="font-semibold text-gray-950">&ldquo;{query}&rdquo;</span></p>
        <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-2" />
      </div>

      {loading ? (
        <div className="text-center py-20 animate-pulse">Đang tìm kiếm...</div>
      ) : (
        <div className="space-y-12">
          
          {/* Products results */}
          <section className="space-y-6">
            <h2 className="text-lg font-bold font-serif text-gray-950 border-b border-gray-100 pb-2">SẢN PHẨM ({products.length})</h2>
            {products.length === 0 ? (
              <p className="text-sm text-gray-500 font-light">Không tìm thấy sản phẩm nào.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => addToCart(product)}
                            className="p-2.5 rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white shadow-md transition-colors"
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

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
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Posts results */}
          <section className="space-y-6">
            <h2 className="text-lg font-bold font-serif text-gray-950 border-b border-gray-100 pb-2">BÀI VIẾT TIN TỨC ({posts.length})</h2>
            {posts.length === 0 ? (
              <p className="text-sm text-gray-500 font-light">Không tìm thấy bài viết nào.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map(post => (
                  <article key={post.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={post.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500'} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-base text-gray-950 line-clamp-2 hover:text-primary transition-colors">
                        <Link href={`/blogs/news/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                      <Link href={`/blogs/news/${post.slug}`} className="text-primary font-bold text-[10px] hover:underline block pt-2">
                        Đọc tiếp &rarr;
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 animate-pulse">Đang tìm kiếm...</div>}>
      <SearchContent />
    </Suspense>
  );
}
