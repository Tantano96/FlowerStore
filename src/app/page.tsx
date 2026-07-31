'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/supabase';
import { Banner, ProductCategory, Product, Post } from '@/types';
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function HomePage() {
  const { addToCart } = useCart();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function loadData() {
      const [dbBanners, dbCats, dbProds, dbPosts] = await Promise.all([
        dbService.getBanners(),
        dbService.getProductCategories(),
        dbService.getProducts({ featured: true }),
        dbService.getPosts({ limit: 3 })
      ]);
      setBanners(dbBanners);
      setCategories(dbCats);
      setFeaturedProducts(dbProds);
      setLatestPosts(dbPosts);
    }
    loadData();
  }, []);

  // Banner Slideshow Auto Play
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="w-full space-y-16 pb-16">
      
      {/* 1. Hero Banner Slider Section */}
      {banners.length > 0 && (
        <div className="relative h-[400px] md:h-[650px] overflow-hidden group">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-black/35 z-10" 
              />
              <img
                src={banner.image_url}
                alt={banner.title || 'Banner'}
                className="w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms] ease-out"
              />
              
              {/* Banner Text / Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20 text-center px-4">
                <div className="max-w-3xl space-y-6">
                  {banner.title && (
                    <h2 className="text-3xl md:text-6xl font-bold text-white font-serif tracking-tight drop-shadow-md animate-fade-in">
                      {banner.title}
                    </h2>
                  )}
                  <p className="text-white/90 text-sm md:text-lg max-w-xl mx-auto drop-shadow-sm font-light">
                    Khám phá dòng sản phẩm trang điểm & chăm sóc da đẳng cấp giúp tôn vinh diện mạo lịch lãm.
                  </p>
                  {banner.link && (
                    <div className="pt-2">
                      <Link
                        href={banner.link}
                        className="inline-block bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-full text-xs md:text-sm hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/30 uppercase tracking-widest btn-premium"
                      >
                        Mua Ngay
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide ? 'bg-primary w-8' : 'bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Product Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-950">Danh Mục Sản Phẩm</h2>
          <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              href={`/products?category=${cat.slug}`}
              className="relative h-[220px] rounded-2xl overflow-hidden group shadow-md block"
            >
              <div className="absolute inset-0 bg-black/45 z-10 transition-colors group-hover:bg-black/55" />
              <img 
                src={cat.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white space-y-1">
                <h3 className="text-lg font-bold font-serif">{cat.name}</h3>
                {cat.description && (
                  <p className="text-xs text-white/80 line-clamp-1 font-light">{cat.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-950">Sản Phẩm Nổi Bật</h2>
            <p className="text-sm text-gray-500 mt-1">Được tuyển chọn và đề xuất bởi các chuyên gia trang điểm</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-primary hover:text-opacity-80 flex items-center transition-colors">
            Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map(product => {
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
                
                {/* Image Gallery */}
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

                {/* Details */}
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
      </section>

      {/* 4. Latest Blogs/News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-950">Tin Tức Mới Nhất</h2>
            <p className="text-sm text-gray-500 mt-1">Xu hướng làm đẹp nam giới, cẩm nang skincare chuẩn khoa học</p>
          </div>
          <Link href="/blogs" className="text-sm font-semibold text-primary hover:text-opacity-80 flex items-center transition-colors">
            Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map(post => (
            <article key={post.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={post.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500'} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-3">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {post.categories?.name || 'Blog'}
                </span>
                <h3 className="font-bold text-base text-gray-950 line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/blogs/news/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
                <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                  <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : ''}</span>
                  <Link href={`/blogs/news/${post.slug}`} className="text-primary font-bold hover:underline">
                    Đọc tiếp
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
