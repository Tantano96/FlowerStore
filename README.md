# CoolBeauty Store Website (Next.js 15 + Supabase)

Dự án website bán mỹ phẩm & blog phong cách CoolBeauty được xây dựng trên công nghệ Next.js 15, TypeScript, Tailwind CSS và Supabase Database.

## Công nghệ sử dụng
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend/Database**: Supabase PostgreSQL.

---

## Hướng dẫn chạy dự án dưới Local

### 1. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Thiết lập cấu hình môi trường (.env.local)
Sao chép tệp cấu hình mẫu và chỉnh sửa thông tin kết nối Supabase của bạn:
```bash
cp .env.example .env.local
```
Mở tệp `.env.local` mới tạo và điền các khóa API của Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
*Lưu ý: Nếu không cấu hình Supabase, hệ thống sẽ tự động chuyển sang chế độ Mock Data thông minh, cho phép xem, mua sắm và quản lý CMS trực tiếp trong bộ nhớ mà không bị crash.*

### 3. Khởi động máy chủ phát triển (Dev server)
```bash
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## Hướng dẫn cấu hình kết nối Supabase

### 1. Tạo Database
Đăng nhập vào bảng điều khiển [Supabase Dashboard](https://supabase.com), tạo dự án mới.
Vào mục **SQL Editor**, sao chép nội dung tệp [schema.sql](file:///e:/Projects/Wordpress/schema.sql) và chạy để khởi tạo các bảng, quan hệ khóa ngoại và chính sách bảo mật RLS.

### 2. Seed dữ liệu mẫu
Vẫn trong mục **SQL Editor**, chạy các truy vấn trong tệp [seed.sql](file:///e:/Projects/Wordpress/seed.sql) để tạo các danh mục sản phẩm, bài viết và banners demo.

---

## Hướng dẫn Deploy lên Vercel

1. Đẩy mã nguồn dự án lên kho lưu trữ GitHub của bạn.
2. Truy cập [Vercel Dashboard](https://vercel.com) và nhấp chọn **New Project** -> Liên kết tài khoản GitHub.
3. Import dự án này từ repo.
4. Cấu hình các biến môi trường (Environment Variables) trong Vercel bằng cách sao chép các khóa từ `.env.local` của bạn:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (URL Production của bạn)
5. Nhấn **Deploy** và chờ quá trình build hoàn thành.

---

## Quản trị CMS
Bạn có thể truy cập trang quản trị bằng đường dẫn: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Tài khoản mặc định**: `admin@coolbeauty.vn`
- **Mật khẩu**: `admin123`

Trang CMS cho phép tạo, sửa, xóa sản phẩm/bài viết sử dụng trình biên soạn Markdown/HTML trực quan, cập nhật trạng thái đơn hàng và tùy biến cấu hình website thời gian thực.
