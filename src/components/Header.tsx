'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Phone, Mail } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { dbService } from '@/lib/supabase';
import { ProductCategory, Category } from '@/types';

export const Header: React.FC = () => {
  const router = useRouter();
  const { cartCount, cartTotal, updateQuantity, cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [productCats, setProductCats] = useState<ProductCategory[]>([]);
  const [postCats, setPostCats] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadHeaderData() {
      const [pCats, bCats, storeSettings] = await Promise.all([
        dbService.getProductCategories(),
        dbService.getCategories(),
        dbService.getSettings()
      ]);
      setProductCats(pCats);
      setPostCats(bCats);
      
      const sMap: Record<string, string> = {};
      storeSettings.forEach(s => {
        sMap[s.key] = s.value;
      });
      setSettings(sMap);
    }
    loadHeaderData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const siteLogo = settings.site_logo || '💄 CoolBeauty';
  const hotline = settings.contact_phone || '1900 6789';

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#1e1e1e] text-white text-xs py-2 px-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1" /> Hotline: {hotline}</span>
          <span className="hidden md:flex items-center"><Mail className="w-3.5 h-3.5 mr-1" /> {settings.contact_email}</span>
        </div>
        <div>
          <Link href="/admin" className="hover:text-primary transition-colors font-medium">Trang Quản Trị (CMS)</Link>
        </div>
      </div>

      {/* Main Header Header Section */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-2 text-gray-700 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-primary font-serif">
                {siteLogo}
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center w-full max-w-md mx-8 relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-gray-50/50"
              />
              <button type="submit" className="absolute right-3 text-gray-400 hover:text-primary">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Actions: Cart Icon */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-full transition-all"
                aria-label="Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Navigation Bar - Horizontal Menu (Desktop Only) */}
          <nav className="hidden lg:flex space-x-8 py-3 border-t border-gray-50 justify-center">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium text-sm transition-colors">TRANG CHỦ</Link>
            
            {/* Products dropdown or links */}
            <div className="relative group">
              <Link href="/products" className="text-gray-700 hover:text-primary font-medium text-sm transition-colors flex items-center">
                SẢN PHẨM
              </Link>
              {productCats.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {productCats.map(cat => (
                      <Link 
                        key={cat.id} 
                        href={`/products?category=${cat.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Blogs */}
            <div className="relative group">
              <Link href="/blogs" className="text-gray-700 hover:text-primary font-medium text-sm transition-colors">
                TIN TỨC & BLOG
              </Link>
              {postCats.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {postCats.map(cat => (
                      <Link 
                        key={cat.id} 
                        href={`/blogs?category=${cat.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-gray-700 hover:text-primary font-medium text-sm transition-colors">VỀ CHÚNG TÔI</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary font-medium text-sm transition-colors">LIÊN HỆ</Link>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-xl z-10 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-primary font-serif">{siteLogo}</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="mb-6 relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none text-sm"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <nav className="flex flex-col space-y-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 font-medium hover:text-primary transition-colors">Trang chủ</Link>
              
              <div className="border-t border-gray-100 pt-3">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-2">Sản Phẩm</span>
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block pl-2 py-1.5 text-gray-700 hover:text-primary font-medium">Tất cả sản phẩm</Link>
                {productCats.map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block pl-4 py-1.5 text-gray-600 hover:text-primary text-sm"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-2">Tin Tức</span>
                <Link href="/blogs" onClick={() => setIsMobileMenuOpen(false)} className="block pl-2 py-1.5 text-gray-700 hover:text-primary font-medium">Tất cả tin tức</Link>
                {postCats.map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/blogs?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block pl-4 py-1.5 text-gray-600 hover:text-primary text-sm"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 font-medium hover:text-primary transition-colors border-t border-gray-100 pt-3">Về chúng tôi</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 font-medium hover:text-primary transition-colors">Liên hệ</Link>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Slider Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-primary" /> Giỏ Hàng ({cartCount})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">Giỏ hàng của bạn còn trống.</p>
                  <Link 
                    href="/products" 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full text-xs font-semibold hover:bg-opacity-90"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex space-x-4 border-b border-gray-100 pb-4">
                    <img 
                      src={item.product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100'} 
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md border border-gray-100" 
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">SKU: {item.product.sku || 'N/A'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:text-black text-sm"
                          >-</button>
                          <span className="px-3 text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:text-black text-sm"
                          >+</button>
                        </div>
                        <span className="text-sm font-bold text-primary">{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Tổng tiền tạm tính:</span>
                  <span className="text-lg font-bold text-primary">{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="w-full border border-gray-200 text-gray-700 py-3 rounded-full text-xs font-semibold hover:bg-gray-50"
                  >
                    Xem giỏ hàng
                  </button>
                  <Link 
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-primary text-white py-3 rounded-full text-xs font-semibold hover:bg-opacity-95 text-center flex items-center justify-center btn-premium"
                  >
                    Tiến hành đặt hàng
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
