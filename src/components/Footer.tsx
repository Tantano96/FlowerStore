'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/supabase';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSettings() {
      const dbSettings = await dbService.getSettings();
      const sMap: Record<string, string> = {};
      dbSettings.forEach(s => {
        sMap[s.key] = s.value;
      });
      setSettings(sMap);
    }
    loadSettings();
  }, []);

  const siteLogo = settings.site_logo || '💄 CoolBeauty';
  const siteDesc = settings.site_description || 'Hệ thống mỹ phẩm, sản phẩm trang điểm & chăm sóc sắc đẹp dành riêng cho phái mạnh.';

  return (
    <footer className="bg-[#1a1a1a] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* About column */}
        <div className="space-y-4">
          <span className="text-2xl font-bold text-white font-serif">{siteLogo}</span>
          <p className="text-sm text-gray-400 leading-relaxed">
            {siteDesc}
          </p>
          <div className="flex space-x-4 pt-2">
            <a href={settings.facebook_url || '#'} className="hover:text-primary transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V2h-3a4 4 0 00-4 4v2z"/>
              </svg>
            </a>
            <a href={settings.instagram_url || '#'} className="hover:text-primary transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-3.594-1.555c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 3.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.212.084 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.557z"/>
              </svg>
            </a>
          </div>
        </div>


        {/* Categories column */}
        <div className="space-y-4">
          <h3 className="text-white text-sm font-bold tracking-wider uppercase">SẢN PHẨM NỔI BẬT</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products?category=cham-soc-da-mat" className="hover:text-primary transition-colors">Chăm sóc da mặt</Link></li>
            <li><Link href="/products?category=trang-diem-mat-moi" className="hover:text-primary transition-colors">Trang điểm mắt & môi</Link></li>
            <li><Link href="/products?category=duong-the-nuoc-hoa" className="hover:text-primary transition-colors">Dưỡng thể & Nước hoa</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Tất cả sản phẩm</Link></li>
          </ul>
        </div>

        {/* Customer policy columns */}
        <div className="space-y-4">
          <h3 className="text-white text-sm font-bold tracking-wider uppercase">HỖ TRỢ KHÁCH HÀNG</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/policy/shipping" className="hover:text-primary transition-colors">Chính sách giao hàng</Link></li>
            <li><Link href="/policy/refund" className="hover:text-primary transition-colors">Chính sách đổi trả</Link></li>
            <li><Link href="/policy/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">Về chúng tôi</Link></li>
          </ul>
        </div>

        {/* Contact column */}
        <div className="space-y-4">
          <h3 className="text-white text-sm font-bold tracking-wider uppercase">THÔNG TIN LIÊN HỆ</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start">
              <MapPin className="w-5 h-5 mr-2 text-primary shrink-0" />
              <span>{settings.contact_address || '123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh'}</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-2.5 text-primary shrink-0" />
              <span>Hotline: {settings.contact_phone || '1900 6789'}</span>
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-2.5 text-primary shrink-0" />
              <span>{settings.contact_email || 'support@coolbeauty.vn'}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} CoolBeauty Store. Powered by Next.js & Supabase.</p>
      </div>
    </footer>
  );
};
