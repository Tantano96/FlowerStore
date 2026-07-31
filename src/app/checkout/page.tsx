'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { dbService } from '@/lib/supabase';
import { ShoppingBag, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{ id: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setSubmitting(true);
    try {
      const orderData = {
        customer_name: name,
        customer_phone: phone,
        customer_email: email || undefined,
        customer_address: address,
        notes: notes || undefined,
        total_amount: cartTotal
      };

      const items = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const newOrder = await dbService.createOrder(orderData, items);
      if (newOrder) {
        setSuccessOrder({ id: newOrder.id });
        clearCart();
      }
    } catch (err) {
      console.error('Failed to submit order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (successOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-950">Đặt Hàng Thành Công!</h2>
          <p className="text-sm text-gray-500 font-light">Cảm ơn bạn đã mua sắm tại CoolBeauty. Đơn hàng của bạn đang được xử lý.</p>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs text-gray-600 max-w-sm mx-auto mt-4 font-mono">
            Mã đơn hàng: {successOrder.id}
          </div>
        </div>
        <div className="pt-4">
          <Link href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full text-xs font-semibold hover:bg-opacity-95 transition-all uppercase tracking-wider btn-premium">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 flex items-center space-x-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-primary">Sản phẩm</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 font-semibold">Thanh toán đặt hàng</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left column: Checkout form details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-950 border-b border-gray-100 pb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary" /> THÔNG TIN GIAO HÀNG
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Giỏ hàng của bạn đang trống để thanh toán.</p>
                <Link href="/products" className="mt-4 inline-block bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold">
                  Đi mua sắm
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Địa chỉ email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary text-sm outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Địa chỉ nhận hàng *</label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary text-sm outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Ghi chú đơn hàng</label>
                  <textarea
                    rows={3}
                    placeholder="Lưu ý cho người giao hàng..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary text-sm outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-4 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-opacity-95 transition-all text-center flex items-center justify-center space-x-2 btn-premium shadow-md disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {submitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-3 uppercase tracking-wider">
              ĐƠN HÀNG CỦA BẠN ({cart.length})
            </h3>
            
            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[300px] pr-2">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center space-x-4 py-3 first:pt-0 last:pb-0">
                  <img
                    src={item.product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính</span>
                <span>{cartTotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-semibold">{cartTotal >= 500000 ? 'Miễn phí' : '30.000đ'}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-950 pt-2 border-t border-gray-100">
                <span>TỔNG CỘNG</span>
                <span className="text-primary text-base">
                  {(cartTotal + (cartTotal >= 500000 ? 0 : 30000)).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
