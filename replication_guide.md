# HƯỚNG DẪN CHI TIẾT TÁI LẬP & PHÁT TRIỂN COOLBEAUTY CLONE

Tài liệu này cung cấp hướng dẫn từng bước cực kỳ chi tiết từ khâu chuẩn bị công cụ, viết mã nguồn, thiết kế cơ sở dữ liệu trên Supabase, đến cấu hình tên miền và xử lý các lỗi thường gặp khi deploy lên Vercel.

---

## 1. Bản Đồ Thư Mục Dự Án (Directory Structure)
Để tạo ra đúng cấu trúc hệ thống, các tệp tin quan trọng được sắp xếp như sau:
```text
wordpress-app/
├── public/                 # Các tài nguyên tĩnh (logo, favicon)
├── src/
│   ├── app/
│   │   ├── about/          # Trang giới thiệu
│   │   ├── admin/          # CMS Quản trị sản phẩm, bài viết, đơn hàng
│   │   ├── blogs/          # Trang danh sách bài viết & chi tiết bài viết
│   │   ├── checkout/       # Giỏ hàng & đặt hàng lưu database
│   │   ├── contact/        # Trang liên hệ
│   │   ├── favicon.ico
│   │   ├── globals.css     # Định nghĩa màu chủ đạo & phông chữ Roboto
│   │   ├── layout.tsx      # Tải phông chữ Roboto & bọc CartProvider
│   │   ├── page.tsx        # Trang chủ (Banner slider, sản phẩm nổi bật, tin tức)
│   │   ├── products/       # Bộ lọc sản phẩm, thương hiệu, giá & chi tiết sản phẩm
│   │   └── search/         # Trang tìm kiếm sản phẩm & bài viết
│   ├── components/
│   │   ├── Header.tsx      # Thanh điều hướng, tìm kiếm & Mega Menu 950px
│   │   └── Footer.tsx      # Chân trang thông tin website
│   ├── lib/
│   │   ├── CartContext.tsx # Quản lý trạng thái giỏ hàng (Cart State)
│   │   ├── mockData.ts     # Dữ liệu offline dự phòng khi mất kết nối Supabase
│   │   └── supabase.ts     # Bộ điều hợp kết nối (Service Layer) & Upload hình ảnh
│   └── types/
│       └── index.ts        # Định nghĩa kiểu dữ liệu TypeScript (Product, Post, Order...)
├── .env.local              # Khóa kết nối Supabase ở local (Không đẩy lên Git)
├── package.json            # Các lệnh chạy và danh sách thư viện
├── schema.sql              # Cấu trúc bảng SQL để chạy trên Supabase
└── seed.sql                # Dữ liệu mẫu để nạp vào Database
```

---

## 2. Quy Trình Thiết Lập Cơ Sở Dữ Liệu (Supabase Setup)

### Bước 2.1: Chạy SQL Tạo Bảng & RLS
Vào **Supabase Console** -> Chọn dự án -> Mở mục **SQL Editor** -> Nhấn **New Query** -> Dán toàn bộ nội dung trong tệp **[schema.sql](file:///e:/Projects/Wordpress/schema.sql)** và nhấn **Run**.
Lệnh này sẽ tạo các bảng:
* `products` & `product_images`: Lưu trữ thông tin sản phẩm và liên kết chứa nhiều ảnh cho một sản phẩm.
* `orders` & `order_items`: Lưu thông tin khách đặt hàng từ trang thanh toán.
* `banners`: Lưu trữ danh sách ảnh trượt kèm link liên kết ở trang chủ.
* `users`: Lưu thông tin người dùng và phân quyền `admin` / `user`.
* `posts` & `categories`: Lưu trữ danh sách bài viết tin tức.

### Bước 2.2: Nạp Dữ Liệu Mẫu (Seeding)
Tạo tiếp một **New Query** trong SQL Editor -> Dán nội dung tệp **[seed.sql](file:///e:/Projects/Wordpress/seed.sql)** và nhấn **Run** để tự động điền các sản phẩm mẫu, danh mục thương hiệu, bài viết tin tức và cấu hình banner trượt lên trang chủ.

### Bước 2.3: Tạo Tài Khoản Admin Đăng Nhập CMS
1. Tại Supabase Dashboard, chọn **Authentication** (biểu tượng chiếc khóa) -> Tab **Users**.
2. Bấm **Add User** -> Chọn **Create User**.
3. Nhập Email: `admin@coolbeauty.vn` và Mật khẩu: `admin123`. Bấm **Create User**.
*(Hệ thống có trigger tự động lắng nghe từ Supabase Auth, khi user này được tạo, nó sẽ tự động chèn thông tin kèm quyền `role = 'admin'` vào bảng `public.users` để bạn đăng nhập vào trang `/admin` ngay lập tức).*

### Bước 2.4: Tạo Storage Lưu Trữ Hình Ảnh Tải Lên
1. Tại Supabase Dashboard, chọn **Storage** (biểu tượng hộp lưu trữ).
2. Nhấp chọn **New Bucket**.
3. Đặt tên chính xác là: **`images`**.
4. **Bắt buộc**: Bật tùy chọn **Public bucket** (cho phép mọi người xem được ảnh).
5. Nhấn **Save**.

---

## 3. Khởi Tạo Mã Nguồn & Chạy Local

### Bước 3.1: Các Lệnh Cài Đặt Ban Đầu
Mở Terminal tại thư mục bạn muốn tạo dự án và chạy lần lượt các lệnh:
```bash
# Khởi tạo dự án Next.js 15
npx -y create-next-app@latest ./ --typescript --tailwind --app --src-dir --import-alias "@/*" --eslint

# Cài đặt các thư viện kết nối cơ sở dữ liệu và hiển thị bài viết
npm install @supabase/supabase-js lucide-react marked
```

### Bước 3.2: Cấu Hình Biến Môi Trường Kết Nối
Tạo tệp **`.env.local`** ở thư mục gốc dự án và điền thông tin dự án Supabase của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hubakvlxxornfrlmbjou.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_veQ22pQzZgrKirkp2n1spQ_Dg_tFikp
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Bước 3.3: Khởi Chạy Local
Chạy lệnh bắt đầu máy chủ phát triển:
```bash
npm run dev
```
Bây giờ, bạn có thể mở trình duyệt truy cập:
* Trang chủ bán hàng: **[http://localhost:3000](http://localhost:3000)**
* Trang quản trị CMS: **[http://localhost:3000/admin](http://localhost:3000/admin)** (đăng nhập bằng tài khoản `admin@coolbeauty.vn` / `admin123` để thêm mới sản phẩm, tải ảnh lên hoặc sửa bài viết trực tiếp).

---

## 4. Quy Trình Đẩy Lên GitHub & Deploy Vercel Công Khai

### Bước 4.1: Đẩy Mã Nguồn Lên GitHub
Nếu dự án chưa liên kết Git, bạn chạy các lệnh sau ở Terminal:
```bash
git init
git remote add origin git@github.com:Tantano96/FlowerStore.git
git branch -M main
git add .
git commit -m "Initialize CoolBeauty project"
git push -u origin main -f
```

### Bước 4.2: Deploy Mới Dự Án Lên Vercel
1. Truy cập trang **Vercel Dashboard** -> Chọn **Add New...** -> **Project**.
2. Chọn Repository **`Tantano96/FlowerStore`** và nhấn **Import**.
3. **Kiểm tra cấu hình mặc định**:
   - Vercel sẽ tự động quét và điền **Framework Preset** là **Next.js**.
   - **Root Directory** là `./`.
4. Cuộn xuống phần **Environment Variables** và điền đầy đủ 3 biến môi trường kết nối:
   - Tên: `NEXT_PUBLIC_SUPABASE_URL` | Giá trị: `https://hubakvlxxornfrlmbjou.supabase.co`
   - Tên: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Giá trị: `sb_publishable_veQ22pQzZgrKirkp2n1spQ_Dg_tFikp`
   - Tên: `NEXT_PUBLIC_SITE_URL` | Giá trị: `https://flower-store-omega.vercel.app` (Link chính của bạn)
5. Nhấn **Deploy** và chờ Vercel biên dịch hoàn tất!

### Bước 4.3: Cấu Hình Tên Miền Chính (Custom Domains)
Nếu bạn muốn sử dụng tên miền riêng của mình như **`flower-store-omega.vercel.app`**:
1. Vào dự án Vercel của bạn -> chọn tab **Settings** -> mục **Domains**.
2. Nhập tên miền muốn liên kết và chọn **Add**.
3. Đảm bảo cấu hình DNS báo trạng thái **tích xanh (Valid Configuration)**. 
4. Nếu truy cập trang web vẫn nhận được màn hình trắng hoặc 404 từ Vercel, hãy vào mục **Settings -> Security** trên Vercel và **chuyển trạng thái Vercel Authentication (Deployment Protection) sang Disabled (Tắt)** để mở cửa truy cập tự do cho mọi người.

---

## 5. Hướng Dẫn Giải Quyết Lỗi Thường Gặp (Troubleshooting)

* **Lỗi `Cannot find module './vendor-chunks/...'` hoặc `ENOENT ... routes-manifest.json`**:
  - *Nguyên nhân*: Do xung đột cache biên dịch khi bạn chuyển đổi các chế độ build Next.js hoặc chạy trùng 2 terminal dev server.
  - *Cách sửa*: Tắt dev server (`Ctrl + C`) và chạy lệnh xóa thư mục cache:
    ```powershell
    Remove-Item -Recurse -Force .next
    ```
    Sau đó khởi chạy lại `npm run dev`.
* **Ảnh tải lên từ CMS Admin bị lỗi hiển thị**:
  - *Nguyên nhân*: Chưa bật chế độ công khai (Public) cho Bucket lưu trữ ảnh trên Supabase Storage.
  - *Cách sửa*: Vào Supabase Storage -> chọn dấu 3 chấm cạnh bucket `images` -> chọn **Make public**.
