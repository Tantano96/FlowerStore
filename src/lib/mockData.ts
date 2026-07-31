import { Category, Tag, Post, ProductCategory, Product, Banner, Setting } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'b303493e-7833-4f9e-a89e-4e4f2081f211',
    name: 'Trang Điểm',
    slug: 'trang-diem',
    description: 'Các xu hướng và bí quyết trang điểm mới nhất',
    created_at: new Date().toISOString()
  },
  {
    id: 'b303493e-7833-4f9e-a89e-4e4f2081f212',
    name: 'Chăm Sóc Da',
    slug: 'cham-soc-da',
    description: 'Hướng dẫn chăm sóc da toàn diện và khoa học',
    created_at: new Date().toISOString()
  },
  {
    id: 'b303493e-7833-4f9e-a89e-4e4f2081f213',
    name: 'Làm Đẹp Nam Giới',
    slug: 'lam-dep-nam-gioi',
    description: 'Bí quyết làm đẹp, chăm sóc tóc và râu dành cho nam giới',
    created_at: new Date().toISOString()
  }
];

export const mockTags: Tag[] = [
  { id: 'a103493e-7833-4f9e-a89e-4e4f2081f221', name: 'Chân mày', slug: 'chan-may', created_at: new Date().toISOString() },
  { id: 'a103493e-7833-4f9e-a89e-4e4f2081f222', name: 'Xu hướng 2018', slug: 'xu-huong-2018', created_at: new Date().toISOString() },
  { id: 'a103493e-7833-4f9e-a89e-4e4f2081f223', name: 'Nam giới', slug: 'nam-gioi', created_at: new Date().toISOString() },
  { id: 'a103493e-7833-4f9e-a89e-4e4f2081f224', name: 'Mỹ phẩm', slug: 'my-pham', created_at: new Date().toISOString() },
  { id: 'a103493e-7833-4f9e-a89e-4e4f2081f225', name: 'Trị mụn', slug: 'tri-mun', created_at: new Date().toISOString() }
];

export const mockProductCategories: ProductCategory[] = [
  {
    id: 'f303493e-7833-4f9e-a89e-4e4f2081f231',
    name: 'Chăm Sóc Da Mặt',
    slug: 'cham-soc-da-mat',
    description: 'Kem dưỡng da, serum, sữa rửa mặt và các sản phẩm chăm sóc chuyên sâu.',
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
    created_at: new Date().toISOString()
  },
  {
    id: 'f303493e-7833-4f9e-a89e-4e4f2081f232',
    name: 'Trang Điểm Mắt & Môi',
    slug: 'trang-diem-mat-moi',
    description: 'Son môi, chì kẻ mày, mascara và phấn mắt cao cấp.',
    image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60',
    created_at: new Date().toISOString()
  },
  {
    id: 'f303493e-7833-4f9e-a89e-4e4f2081f233',
    name: 'Dưỡng Thể & Nước Hoa',
    slug: 'duong-the-nuoc-hoa',
    description: 'Sữa tắm, kem dưỡng body và nước hoa nam nữ quý phái.',
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&auto=format&fit=crop&q=60',
    created_at: new Date().toISOString()
  }
];

export const mockProducts: Product[] = [
  {
    id: 'd303493e-7833-4f9e-a89e-4e4f2081f241',
    name: 'Chì Kẻ Mày Nam Cao Cấp CoolBoy',
    slug: 'chi-ke-may-nam-coolboy',
    description: 'Sản phẩm chì kẻ chân mày thiết kế chuyên biệt cho nam giới, giúp tạo nét tự nhiên, sắc sảo mà không bị lộ. Đầu chì mềm mịn, dễ vẽ, lâu trôi suốt cả ngày dài năng động.',
    price: 150000,
    compare_at_price: 220000,
    sku: 'CKM001',
    category_id: 'f303493e-7833-4f9e-a89e-4e4f2081f232',
    stock: 120,
    featured: true,
    created_at: new Date().toISOString(),
    product_categories: mockProductCategories[1],
    product_images: [
      { id: 'b103493e-7833-4f9e-a89e-4e4f2081f251', product_id: 'd303493e-7833-4f9e-a89e-4e4f2081f241', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80', sort_order: 1, created_at: '' },
      { id: 'b103493e-7833-4f9e-a89e-4e4f2081f252', product_id: 'd303493e-7833-4f9e-a89e-4e4f2081f241', image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80', sort_order: 2, created_at: '' }
    ]
  },
  {
    id: 'd303493e-7833-4f9e-a89e-4e4f2081f242',
    name: 'Serum Trị Mụn Thảo Dược AcneClear',
    slug: 'serum-tri-mun-acneclear',
    description: 'Serum chứa tinh chất trà tràm và rau má tự nhiên giúp làm dịu nốt mụn viêm nhanh chóng sau 24h, điều tiết bã nhờn và giảm thâm mụn hiệu quả mà không làm khô da.',
    price: 290000,
    compare_at_price: 350000,
    sku: 'SR002',
    category_id: 'f303493e-7833-4f9e-a89e-4e4f2081f231',
    stock: 85,
    featured: true,
    created_at: new Date().toISOString(),
    product_categories: mockProductCategories[0],
    product_images: [
      { id: 'b103493e-7833-4f9e-a89e-4e4f2081f253', product_id: 'd303493e-7833-4f9e-a89e-4e4f2081f242', image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', sort_order: 1, created_at: '' }
    ]
  },
  {
    id: 'd303493e-7833-4f9e-a89e-4e4f2081f243',
    name: 'Sữa Rửa Mặt Sáng Da Than Hoạt Tính',
    slug: 'sua-rua-mat-than-hoat-tinh',
    description: 'Với công thức từ than tre hoạt tính hoạt hóa, sữa rửa mặt giúp hút sạch bụi bẩn, độc tố sâu trong lỗ chân lông, ngăn chặn hình thành mụn đầu đen và đem lại làn da sáng khỏe.',
    price: 180000,
    compare_at_price: 200000,
    sku: 'SRM003',
    category_id: 'f303493e-7833-4f9e-a89e-4e4f2081f231',
    stock: 150,
    featured: false,
    created_at: new Date().toISOString(),
    product_categories: mockProductCategories[0],
    product_images: [
      { id: 'b103493e-7833-4f9e-a89e-4e4f2081f254', product_id: 'd303493e-7833-4f9e-a89e-4e4f2081f243', image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80', sort_order: 1, created_at: '' }
    ]
  },
  {
    id: 'd303493e-7833-4f9e-a89e-4e4f2081f244',
    name: 'Nước Hoa Unisex Elegant Wood 50ml',
    slug: 'nuoc-hoa-elegant-wood',
    description: 'Mùi hương gỗ tuyết tùng trầm ấm kết hợp cùng hương cam bergamot thanh mát tạo nên sức hút tinh tế, lịch lãm và quý phái phù hợp cho cả nam và nữ.',
    price: 850000,
    compare_at_price: 990000,
    sku: 'NH004',
    category_id: 'f303493e-7833-4f9e-a89e-4e4f2081f233',
    stock: 45,
    featured: true,
    created_at: new Date().toISOString(),
    product_categories: mockProductCategories[2],
    product_images: [
      { id: 'b103493e-7833-4f9e-a89e-4e4f2081f255', product_id: 'd303493e-7833-4f9e-a89e-4e4f2081f244', image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80', sort_order: 1, created_at: '' }
    ]
  }
];

export const mockPosts: Post[] = [
  {
    id: 'e303493e-7833-4f9e-a89e-4e4f2081f261',
    title: 'Xu hướng lông mày nam năm 2018 không thể không biết',
    slug: 'xu-huong-long-may-nam-2018-khong-the-khong-biet',
    summary: 'Đôi lông mày dày, rậm và sắc nét luôn là niềm ao ước của phái mạnh. Điểm qua các xu hướng chân mày nam nổi bật nhất năm nay giúp tăng phần nam tính, cuốn hút.',
    content: `<p>Đôi lông mày là một trong những điểm nhấn quan trọng nhất trên khuôn mặt của người đàn ông. Một hàng lông mày rậm, đều và có dáng rõ ràng không chỉ giúp tôn lên đường nét nam tính mà còn làm cho đôi mắt trông sâu và có hồn hơn.</p>
<h3>1. Xu Hướng Lông Mày Nam Tự Nhiên Rậm Dày</h3>
<p>Năm 2018 đánh dấu sự lên ngôi của dáng mày rậm tự nhiên. Không còn những kiểu cạo tỉa quá mỏng hay kẻ vẽ sắc lẹm giả tạo, đấng mày râu chuộng kiểu chân mày giữ nguyên độ dày tự nhiên nhưng được định hình gọn gàng bằng gel chuốt mày hoặc chì kẻ chuyên nghiệp.</p>
<h3>2. Kiểu Chân Mày Kiếm (Kiếm Mày)</h3>
<p>Dáng mày này có đặc điểm là phần đuôi mày nhếch ngược lên như hình mũi kiếm. Nó biểu trưng cho tính cách mạnh mẽ, quyết đoán của đấng nam nhi và rất được yêu thích tại khu vực châu Á.</p>
<h3>3. Cách Chăm Sóc Và Tạo Kiểu Chân Mày Cho Nam Giới</h3>
<ul>
<li>Tỉa bớt các sợi lông mọc lệch lệch ngoài khuôn chân mày bằng nhíp hoặc dao cạo nhỏ.</li>
<li>Sử dụng chì kẻ mày tông nâu đen hoặc đen xám để dặm những vùng thưa thớt sợi.</li>
<li>Chuốt lại bằng mascara trong suốt để cố định nếp mày suốt cả ngày.</li>
</ul>
<p>Đầu tư một chút thời gian chăm sóc chân mày mỗi ngày sẽ giúp bạn nâng tầm diện mạo đáng kể. Hãy bắt đầu ngay hôm nay nhé!</p>`,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
    category_id: 'b303493e-7833-4f9e-a89e-4e4f2081f213',
    published_at: new Date().toISOString(),
    is_published: true,
    created_at: new Date().toISOString(),
    categories: mockCategories[2],
    post_tags: [
      { tag_id: 'a103493e-7833-4f9e-a89e-4e4f2081f221', tags: mockTags[0] },
      { tag_id: 'a103493e-7833-4f9e-a89e-4e4f2081f222', tags: mockTags[1] },
      { tag_id: 'a103493e-7833-4f9e-a89e-4e4f2081f223', tags: mockTags[2] }
    ]
  },
  {
    id: 'e303493e-7833-4f9e-a89e-4e4f2081f262',
    title: 'Quy trình skincare 5 bước đơn giản cho da mụn buổi tối',
    slug: 'quy-trinh-skincare-5-buoc-da-mun-buoi-toi',
    summary: 'Da mụn cần một chế độ chăm sóc tối giản nhưng hiệu quả để làm sạch sâu, kháng viêm và phục hồi hàng rào bảo vệ da. Tìm hiểu ngay quy trình skincare 5 bước chuẩn y khoa dưới đây.',
    content: `<p>Chăm sóc làn da mụn chưa bao giờ là điều dễ dàng, nhất là khi đêm xuống - thời điểm làn da của chúng ta thực hiện quá trình tái tạo và hấp thu dưỡng chất mạnh mẽ nhất. Để khắc phục tình trạng mụn sưng viêm mà không làm da bị kích ứng, hãy áp dụng quy trình skincare tối giản gồm 5 bước sau:</p>
<h4>Bước 1: Tẩy trang sạch sâu</h4>
<p>Dù có trang điểm hay không, bạn vẫn cần tẩy trang vào buổi tối để hòa tan lớp kem chống nắng, dầu thừa và bụi mịn bám chặt trên da suốt cả ngày.</p>
<h4>Bước 2: Sữa rửa mặt dịu nhẹ</h4>
<p>Nên chọn dòng sữa rửa mặt có độ pH cân bằng 5.5, chứa Salicylic Acid (BHA) giúp len lỏi sâu làm sạch dầu tắc nghẽn trong cổ nang lông.</p>
<h4>Bước 3: Nước hoa hồng cân bằng (Toner)</h4>
<p>Làm dịu da tức thì, phục hồi độ ẩm và chuẩn bị một lớp nền ẩm mượt để các bước dưỡng chất tiếp theo thẩm thấu tốt hơn.</p>
<h4>Bước 4: Serum trị mụn / Tinh chất đặc trị</h4>
<p>Thoa một lớp mỏng serum có thành phần Tea Tree Oil, Niacinamide hoặc BHA lên vùng da mụn để tiêu sưng kháng viêm.</p>
<h4>Bước 5: Kem dưỡng ẩm dạng gel mỏng nhẹ</h4>
<p>Khóa ẩm lại để ngăn hơi nước bốc hơi khỏi da. Chọn kết cấu dạng gel-cream mỏng nhẹ để tránh gây bít tắc nang lông sinh thêm nhân mụn mới.</p>`,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    category_id: 'b303493e-7833-4f9e-a89e-4e4f2081f212',
    published_at: new Date().toISOString(),
    is_published: true,
    created_at: new Date().toISOString(),
    categories: mockCategories[1],
    post_tags: [
      { tag_id: 'a103493e-7833-4f9e-a89e-4e4f2081f224', tags: mockTags[3] },
      { tag_id: 'a103493e-7833-4f9e-a89e-4e4f2081f225', tags: mockTags[4] }
    ]
  }
];

export const mockBanners: Banner[] = [
  {
    id: 'a303493e-7833-4f9e-a89e-4e4f2081f271',
    title: 'Mỹ Phẩm Nam Giới Cao Cấp',
    image_url: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=1600&auto=format&fit=crop&q=80',
    link_url: '/collections/cham-soc-da-mat',
    sort_order: 1,
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'a303493e-7833-4f9e-a89e-4e4f2081f272',
    title: 'Định Hình Phong Cách Đàn Ông',
    image_url: 'https://images.unsplash.com/photo-1517832606589-7a598b389a03?w=1600&auto=format&fit=crop&q=80',
    link_url: '/blogs/news/xu-huong-long-may-nam-2018-khong-the-khong-biet',
    sort_order: 2,
    active: true,
    created_at: new Date().toISOString()
  }
];

export const mockSettings: Setting[] = [
  { key: 'site_name', value: 'CoolBeauty Store', description: 'Tên thương hiệu website', created_at: '' },
  { key: 'site_logo', value: '💄 CoolBeauty', description: 'Logo hiển thị text', created_at: '' },
  { key: 'site_description', value: 'Hệ thống mỹ phẩm và chăm sóc sắc đẹp dành riêng cho phái mạnh và mọi giới tính.', description: 'Mô tả SEO website', created_at: '' },
  { key: 'contact_email', value: 'support@coolbeauty.vn', description: 'Email hỗ trợ liên hệ', created_at: '' },
  { key: 'contact_phone', value: '1900 6789', description: 'Số hotline liên hệ', created_at: '' },
  { key: 'contact_address', value: '123 Đường Ba Tháng Hai, Quận 10, Thành phố Hồ Chí Minh', description: 'Địa chỉ cửa hàng', created_at: '' },
  { key: 'facebook_url', value: 'https://facebook.com', description: 'Link Fanpage Facebook', created_at: '' },
  { key: 'instagram_url', value: 'https://instagram.com', description: 'Link Instagram', created_at: '' }
];
