'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { dbService } from '@/lib/supabase';
import { Product } from '@/types';
import { ShoppingCart, ShieldCheck, Truck, RefreshCw, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const prod = await dbService.getProductBySlug(slug);
      if (prod) {
        setProduct(prod);
        if (prod.product_images && prod.product_images.length > 0) {
          setActiveImage(prod.product_images[0].image_url);
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-pulse space-y-8">
        <div className="h-6 w-48 bg-gray-100 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-[450px] bg-gray-100 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-gray-100 rounded-md" />
            <div className="h-6 w-1/3 bg-gray-100 rounded-md" />
            <div className="h-24 bg-gray-100 rounded-md" />
            <div className="h-12 w-1/2 bg-gray-100 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500">Sản phẩm này không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link href="/products" className="inline-block bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const discountAmount = product.compare_at_price ? product.compare_at_price - product.price : 0;
  const discountPercent = product.compare_at_price 
    ? Math.round((discountAmount / product.compare_at_price) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 flex items-center space-x-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-primary">Sản phẩm</Link>
        {product.product_categories && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/products?category=${product.product_categories.slug}`} className="hover:text-primary">
              {product.product_categories.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main product box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">
            <img 
              src={activeImage || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'} 
              alt={product.name}
              className="w-full h-full object-cover transition-all"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>
          {/* Thumbnails list */}
          {product.product_images && product.product_images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto py-1">
              {product.product_images.map(img => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                    activeImage === img.image_url ? 'border-primary' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs text-primary font-bold tracking-wider uppercase">
              {product.product_categories?.name || 'Mỹ Phẩm'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-950 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-gray-400">Mã sản phẩm: <span className="font-semibold text-gray-700">{product.sku || 'N/A'}</span> | Tình trạng: <span className="font-semibold text-green-600">{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span></p>
          </div>

          <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100/50 flex items-baseline space-x-3">
            <span className="text-2xl font-bold text-primary">
              {product.price.toLocaleString('vi-VN')}đ
            </span>
            {product.compare_at_price && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {product.compare_at_price.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">
                  Tiết kiệm {discountAmount.toLocaleString('vi-VN')}đ
                </span>
              </>
            )}
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">MÔ TẢ NGẮN</h3>
              <p className="font-light">{product.description}</p>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:text-black font-semibold"
                >-</button>
                <span className="px-4 text-sm font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-1.5 text-gray-600 hover:text-black font-semibold"
                >+</button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-primary text-white py-4 rounded-full font-semibold text-xs tracking-wider uppercase hover:bg-opacity-95 transition-all text-center flex items-center justify-center space-x-2 btn-premium shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm vào giỏ hàng</span>
              </button>
            </div>
          </div>

          {/* Policy details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-xs text-gray-500 font-light">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-primary shrink-0" />
              <span>Giao hàng miễn phí toàn quốc từ 500k</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span>Cam kết 100% chính hãng</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-primary shrink-0" />
              <span>Đổi trả linh hoạt trong 7 ngày</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
