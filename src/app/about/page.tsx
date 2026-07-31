import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-bold font-serif text-gray-950 text-center">Về Chúng Tôi</h1>
      <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
      
      <div className="prose max-w-none text-sm text-gray-600 leading-relaxed font-light space-y-4">
        <p>Chào mừng bạn đến với <strong>CoolBeauty</strong> - điểm đến lý tưởng cung cấp các dòng sản phẩm làm đẹp, chăm sóc da mặt và trang điểm cao cấp. Chúng tôi định hình một phong cách hiện đại, tự tin, và lịch lãm cho mọi giới tính.</p>
        <p>Thành lập từ năm 2018, CoolBeauty không ngừng mở rộng và đa dạng hóa các dòng sản phẩm từ chì kẻ mày chuyên biệt, serum thảo dược trị mụn cho đến nước hoa trầm ấm. Mọi sản phẩm tại CoolBeauty đều được tuyển chọn kỹ lưỡng, đảm bảo tính an toàn, lành tính và mang lại hiệu quả vượt trội cho làn da của bạn.</p>
        <p>Hãy cùng đồng hành với chúng tôi trên hành trình tự tin tỏa sáng và định hình phong cách cá nhân độc bản!</p>
      </div>

      <div className="text-center pt-6">
        <Link href="/products" className="inline-block bg-primary text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-opacity-95 transition-all btn-premium">
          Khám phá sản phẩm
        </Link>
      </div>
    </div>
  );
}
