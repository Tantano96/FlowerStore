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
      <div className="bg-white text-gray-700 text-xs py-2.5 border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="tel:0912117494" className="flex items-center hover:text-[#ff5258] transition-colors">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-[#ff5258]" /> 0912117494
            </a>
            <a href="mailto:dualeotheme@gmail.com" className="flex items-center hover:text-[#ff5258] transition-colors">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-[#ff5258]" /> dualeotheme@gmail.com
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/checkout" className="hover:text-[#ff5258] transition-colors">Kiểm tra đơn hàng</Link>
            <Link href="/contact" className="hover:text-[#ff5258] transition-colors">Hệ thống cửa hàng</Link>
            <Link href="/admin" className="hover:text-[#ff5258] transition-colors font-semibold text-[#ff5258]">Trang Quản Trị (CMS)</Link>
          </div>
        </div>
      </div>

      {/* Main Header Header Section (Pinkish Peach background) */}
      <div className="bg-[#fff1f1] border-b border-[#ffe3e3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-2 text-gray-700 hover:text-[#ff5258] focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo matching 2! Cool Beauty */}
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-extrabold tracking-tight text-gray-950 font-sans flex items-center">
                <span className="text-[#ff5258] mr-1">2!</span>
                <span className="flex flex-col leading-none">
                  <span className="text-xl tracking-[0.2em] font-black uppercase">COOL</span>
                  <span className="text-xs tracking-[0.1em] text-gray-600 font-bold uppercase mt-0.5">BEAUTY</span>
                </span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center w-full max-w-lg mx-12 relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-14 py-2.5 rounded-md border border-[#ffd2d2] focus:outline-none focus:ring-1 focus:ring-[#ff5258] focus:border-[#ff5258] text-sm bg-white"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 bg-[#ff5258] hover:bg-[#e0464c] text-white px-5 rounded-r-md transition-colors flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Actions: Profile, Cart */}
            <div className="flex items-center space-x-5">
              <Link href="/admin" className="p-2 text-gray-700 hover:text-[#ff5258] hidden md:block" title="Tài khoản">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-gray-700 hover:text-[#ff5258] transition-all"
                aria-label="Cart"
              >
                <div className="relative">
                  <svg className="w-7 h-7 text-gray-800 hover:text-[#ff5258]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-[#ff5258] text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Horizontal Navigation Menu (Coral-red background) */}
      <header className="sticky top-0 z-40 bg-[#ff5258] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden lg:flex space-x-1 justify-start">
            <Link href="/" className="text-white hover:bg-[#e0464c] px-5 py-4 font-bold text-xs tracking-wider transition-colors uppercase">TRANG CHỦ</Link>
            <Link href="/about" className="text-white hover:bg-[#e0464c] px-5 py-4 font-bold text-xs tracking-wider transition-colors uppercase">GIỚI THIỆU</Link>
            
            {/* Products dropdown with Mega Menu */}
            <div className="relative group">
              <Link href="/products" className="text-white hover:bg-[#e0464c] px-5 py-4 font-bold text-xs tracking-wider transition-colors uppercase flex items-center">
                SẢN PHẨM
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </Link>
              
              {/* Mega Dropdown Box matching screenshot */}
              <div className="absolute left-0 top-full w-[950px] bg-white text-gray-800 shadow-2xl border border-gray-100 rounded-b-lg p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 grid grid-cols-6 gap-6">
                
                {/* Column 1: Dưỡng da */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#ff5258] border-b border-gray-100 pb-1 uppercase">Dưỡng da</h4>
                  <ul className="space-y-2 text-xs text-gray-600 font-medium">
                    <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-[#ff5258]">Mặt nạ</Link></li>
                    <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-[#ff5258]">Kem dưỡng</Link></li>
                    <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-[#ff5258]">Kem chống nắng</Link></li>
                    <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-[#ff5258]">Xịt khoáng</Link></li>
                  </ul>
                </div>

                {/* Column 2: Làm sạch */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#ff5258] border-b border-gray-100 pb-1 uppercase">Làm sạch</h4>
                  <ul className="space-y-2 text-xs text-gray-600 font-medium">
                    <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-[#ff5258]">Sữa rửa mặt</Link></li>
                    <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-[#ff5258]">Dầu tẩy trang</Link></li>
                    <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-[#ff5258]">Kem tẩy trang</Link></li>
                    <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-[#ff5258]">Nước tẩy trang</Link></li>
                  </ul>
                </div>

                {/* Column 3: Trang điểm nền */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#ff5258] border-b border-gray-100 pb-1 uppercase">Trang điểm nền</h4>
                  <ul className="space-y-2 text-xs text-gray-600 font-medium">
                    <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-[#ff5258]">Kem lót</Link></li>
                    <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-[#ff5258]">Kem tạo hiệu ứng</Link></li>
                    <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-[#ff5258]">Kem che khuyết điểm</Link></li>
                    <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-[#ff5258]">Phấn phủ bột</Link></li>
                  </ul>
                </div>

                {/* Column 4: Trang điểm mắt môi */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#ff5258] border-b border-gray-100 pb-1 uppercase">Trang điểm mắt môi</h4>
                  <ul className="space-y-2 text-xs text-gray-600 font-medium">
                    <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-[#ff5258]">Son thỏi</Link></li>
                    <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-[#ff5258]">Son dưỡng</Link></li>
                    <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-[#ff5258]">Màu mắt</Link></li>
                    <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-[#ff5258]">Viền mắt</Link></li>
                  </ul>
                </div>

                {/* Column 5: Chăm sóc cơ thể */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#ff5258] border-b border-gray-100 pb-1 uppercase">Chăm sóc cơ thể</h4>
                  <ul className="space-y-2 text-xs text-gray-600 font-medium">
                    <li><Link href="/products?category=duong-the-nuoc-hoa" className="hover:text-[#ff5258]">Sữa tắm</Link></li>
                    <li><Link href="/products?category=duong-the-nuoc-hoa" className="hover:text-[#ff5258]">Sữa dưỡng thể</Link></li>
                    <li><Link href="/products?category=duong-the-nuoc-hoa" className="hover:text-[#ff5258]">Nước hoa</Link></li>
                    <li><Link href="/products?category=duong-the-nuoc-hoa" className="hover:text-[#ff5258]">Dầu gội, dầu xả</Link></li>
                  </ul>
                </div>

                {/* Column 6: Banner Image Column */}
                <div className="col-span-1 flex items-center justify-center border-l border-gray-100 pl-4">
                  <div className="relative group/banner overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80" 
                      alt="Mega Menu Banner" 
                      className="w-full h-auto object-cover transform transition-transform group-hover/banner:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="text-[10px] bg-white/95 text-[#ff5258] font-bold px-2.5 py-1 rounded shadow-sm">BEAUTY STORE</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <Link href="/products?category=trang-diem-mat-moi" className="text-white hover:bg-[#e0464c] px-5 py-4 font-bold text-xs tracking-wider transition-colors uppercase">KHUYẾN MÃI HOT</Link>
            <Link href="/blogs" className="text-white hover:bg-[#e0464c] px-5 py-4 font-bold text-xs tracking-wider transition-colors uppercase">TIN TỨC</Link>
            <Link href="/contact" className="text-white hover:bg-[#e0464c] px-5 py-4 font-bold text-xs tracking-wider transition-colors uppercase">LIÊN HỆ</Link>
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
