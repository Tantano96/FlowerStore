import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-serif text-gray-950">Liên Hệ</h1>
        <p className="text-sm text-gray-500 font-light">Chúng tôi luôn sẵn sàng lắng nghe và phản hồi thắc mắc của bạn.</p>
        <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Info list */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">THÔNG TIN LIÊN HỆ CHI TIẾT</h2>
          <ul className="space-y-4 text-sm text-gray-600 font-light">
            <li className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-primary shrink-0" />
              <span>123 Đường Ba Tháng Hai, Quận 10, Thành phố Hồ Chí Minh</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-3.5 text-primary shrink-0" />
              <span>Điện thoại: 1900 6789</span>
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-3.5 text-primary shrink-0" />
              <span>Email: support@coolbeauty.vn</span>
            </li>
          </ul>
        </div>

        {/* Message form */}
        <form className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100/50">
          <h3 className="text-sm font-bold text-gray-900">GỬI LỜI NHẮN CHO CHÚNG TÔI</h3>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Họ tên *</label>
            <input type="text" required placeholder="Nguyễn Văn A" className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Email của bạn *</label>
            <input type="email" required placeholder="email@example.com" className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Nội dung liên hệ *</label>
            <textarea rows={3} required placeholder="Ý kiến phản hồi hoặc câu hỏi của bạn..." className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-1 focus:ring-primary outline-none resize-none" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-opacity-95 transition-all btn-premium shadow-sm">
            GỬI LIÊN HỆ
          </button>
        </form>

      </div>
    </div>
  );
}
