import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | CoolBeauty Store',
    default: 'CoolBeauty Store - Mỹ Phẩm Nam Giới & Chăm Sóc Sắc Đẹp'
  },
  description: 'CoolBeauty chuyên cung cấp các dòng mỹ phẩm, chăm sóc da mặt và trang điểm cao cấp dành riêng cho nam giới và mọi giới tính.',
  keywords: 'my pham, trang diem nam, cham soc da, coolbeauty, son moi, ke may nam',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'CoolBeauty Store',
    description: 'Hệ thống mỹ phẩm và chăm sóc sắc đẹp cao cấp.',
    url: '/',
    siteName: 'CoolBeauty',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=1200',
        width: 1200,
        height: 630
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-white">
        <CartProvider>
          <Header />
          <main className="flex-1 bg-white">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
