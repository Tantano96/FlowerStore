-- Seed Data for CoolBeauty Clone

-- Categories (Blog Categories)
INSERT INTO public.categories (id, name, slug, description) VALUES
('b303493e-7833-4f9e-a89e-4e4f2081f211', 'Trang Điểm', 'trang-diem', 'Các xu hướng và bí quyết trang điểm mới nhất'),
('b303493e-7833-4f9e-a89e-4e4f2081f212', 'Chăm Sóc Da', 'cham-soc-da', 'Hướng dẫn chăm sóc da toàn diện và khoa học'),
('b303493e-7833-4f9e-a89e-4e4f2081f213', 'Làm Đẹp Nam Giới', 'lam-dep-nam-gioi', 'Bí quyết làm đẹp, chăm sóc tóc và râu dành cho nam giới');

-- Tags
INSERT INTO public.tags (id, name, slug) VALUES
('a103493e-7833-4f9e-a89e-4e4f2081f221', 'Chân mày', 'chan-may'),
('a103493e-7833-4f9e-a89e-4e4f2081f222', 'Xu hướng 2018', 'xu-huong-2018'),
('a103493e-7833-4f9e-a89e-4e4f2081f223', 'Nam giới', 'nam-gioi'),
('a103493e-7833-4f9e-a89e-4e4f2081f224', 'Mỹ phẩm', 'my-pham'),
('a103493e-7833-4f9e-a89e-4e4f2081f225', 'Trị mụn', 'tri-mun');

-- Product Categories
INSERT INTO public.product_categories (id, name, slug, description, image_url) VALUES
('f303493e-7833-4f9e-a89e-4e4f2081f231', 'Chăm Sóc Da Mặt', 'cham-soc-da-mat', 'Kem dưỡng da, serum, sữa rửa mặt và các sản phẩm chăm sóc chuyên sâu.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60'),
('f303493e-7833-4f9e-a89e-4e4f2081f232', 'Trang Điểm Mắt & Môi', 'trang-diem-mat-moi', 'Son môi, chì kẻ mày, mascara và phấn mắt cao cấp.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60'),
('f303493e-7833-4f9e-a89e-4e4f2081f233', 'Dưỡng Thể & Nước Hoa', 'duong-the-nuoc-hoa', 'Sữa tắm, kem dưỡng body và nước hoa nam nữ quý phái.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&auto=format&fit=crop&q=60');

-- Products
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, category_id, stock, featured) VALUES
('d303493e-7833-4f9e-a89e-4e4f2081f241', 'Chì Kẻ Mày Nam Cao Cấp CoolBoy', 'chi-ke-may-nam-coolboy', 'Sản phẩm chì kẻ chân mày thiết kế chuyên biệt cho nam giới, giúp tạo nét tự nhiên, sắc sảo mà không bị lộ. Đầu chì mềm mịn, dễ vẽ, lâu trôi suốt cả ngày dài năng động.', 150000, 220000, 'CKM001', 'f303493e-7833-4f9e-a89e-4e4f2081f232', 120, true),
('d303493e-7833-4f9e-a89e-4e4f2081f242', 'Serum Trị Mụn Thảo Dược AcneClear', 'serum-tri-mun-acneclear', 'Serum chứa tinh chất trà tràm và rau má tự nhiên giúp làm dịu nốt mụn viêm nhanh chóng sau 24h, điều tiết bã nhờn và giảm thâm mụn hiệu quả mà không làm khô da.', 290000, 350000, 'SR002', 'f303493e-7833-4f9e-a89e-4e4f2081f231', 85, true),
('d303493e-7833-4f9e-a89e-4e4f2081f243', 'Sữa Rửa Mặt Sáng Da Than Hoạt Tính', 'sua-rua-mat-than-hoat-tinh', 'Với công thức từ than tre hoạt tính hoạt hóa, sữa rửa mặt giúp hút sạch bụi bẩn, độc tố sâu trong lỗ chân lông, ngăn chặn hình thành mụn đầu đen và đem lại làn da sáng khỏe.', 180000, 200000, 'SRM003', 'f303493e-7833-4f9e-a89e-4e4f2081f231', 150, false),
('d303493e-7833-4f9e-a89e-4e4f2081f244', 'Nước Hoa Unisex Elegant Wood 50ml', 'nuoc-hoa-elegant-wood', 'Mùi hương gỗ tuyết tùng trầm ấm kết hợp cùng hương cam bergamot thanh mát tạo nên sức hút tinh tế, lịch lãm và quý phái phù hợp cho cả nam và nữ.', 850000, 990000, 'NH004', 'f303493e-7833-4f9e-a89e-4e4f2081f233', 45, true);

-- Product Images
INSERT INTO public.product_images (id, product_id, image_url, sort_order) VALUES
('b103493e-7833-4f9e-a89e-4e4f2081f251', 'd303493e-7833-4f9e-a89e-4e4f2081f241', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80', 1),
('b103493e-7833-4f9e-a89e-4e4f2081f252', 'd303493e-7833-4f9e-a89e-4e4f2081f241', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80', 2),
('b103493e-7833-4f9e-a89e-4e4f2081f253', 'd303493e-7833-4f9e-a89e-4e4f2081f242', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', 1),
('b103493e-7833-4f9e-a89e-4e4f2081f254', 'd303493e-7833-4f9e-a89e-4e4f2081f243', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80', 1),
('b103493e-7833-4f9e-a89e-4e4f2081f255', 'd303493e-7833-4f9e-a89e-4e4f2081f244', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80', 1);

-- Posts
INSERT INTO public.posts (id, title, slug, summary, content, image_url, category_id, published_at, is_published) VALUES
('e303493e-7833-4f9e-a89e-4e4f2081f261', 'Xu hướng lông mày nam năm 2018 không thể không biết', 'xu-huong-long-may-nam-2018-khong-the-khong-biet', 'Đôi lông mày dày, rậm và sắc nét luôn là niềm ao ước của phái mạnh. Điểm qua các xu hướng chân mày nam nổi bật nhất năm nay giúp tăng phần nam tính, cuốn hút.', '<p>Đôi lông mày là một trong những điểm nhấn quan trọng nhất trên khuôn mặt của người đàn ông. Một hàng lông mày rậm, đều và có dáng rõ ràng không chỉ giúp tôn lên đường nét nam tính mà còn làm cho đôi mắt trông sâu và có hồn hơn.</p><h3>1. Xu Hướng Lông Mày Nam Tự Nhiên Rậm Dày</h3><p>Năm 2018 đánh dấu sự lên ngôi của dáng mày rậm tự nhiên. Không còn những kiểu cạo tỉa quá mỏng hay kẻ vẽ sắc lẹm giả tạo, đấng mày râu chuộng kiểu chân mày giữ nguyên độ dày tự nhiên nhưng được định hình gọn gàng bằng gel chuốt mày hoặc chì kẻ chuyên nghiệp.</p><h3>2. Kiểu Chân Mày Kiếm (Kiếm Mày)</h3><p>Dáng mày này có đặc điểm là phần đuôi mày nhếch ngược lên như hình mũi kiếm. Nó biểu trưng cho tính cách mạnh mẽ, quyết đoán của đấng nam nhi và rất được yêu thích tại khu vực châu Á.</p><h3>3. Cách Chăm Sóc Và Tạo Kiểu Chân Mày Cho Nam Giới</h3><ul><li>Tỉa bớt các sợi lông mọc lệch lệch ngoài khuôn chân mày bằng nhíp hoặc dao cạo nhỏ.</li><li>Sử dụng chì kẻ mày tông nâu đen hoặc đen xám để dặm những vùng thưa thớt sợi.</li><li>Chuốt lại bằng mascara trong suốt để cố định nếp mày suốt cả ngày.</li></ul><p>Đầu tư một chút thời gian chăm sóc chân mày mỗi ngày sẽ giúp bạn nâng tầm diện mạo đáng kể. Hãy bắt đầu ngay hôm nay nhé!</p>', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80', 'b303493e-7833-4f9e-a89e-4e4f2081f213', timezone('utc'::text, now()), true),
('e303493e-7833-4f9e-a89e-4e4f2081f262', 'Quy trình skincare 5 bước đơn giản cho da mụn buổi tối', 'quy-trinh-skincare-5-buoc-da-mun-buoi-toi', 'Da mụn cần một chế độ chăm sóc tối giản nhưng hiệu quả để làm sạch sâu, kháng viêm và phục hồi hàng rào bảo vệ da. Tìm hiểu ngay quy trình skincare 5 bước chuẩn y khoa dưới đây.', '<p>Chăm sóc làn da mụn chưa bao giờ là điều dễ dàng, nhất là khi đêm xuống - thời điểm làn da của chúng ta thực hiện quá trình tái tạo và hấp thu dưỡng chất mạnh mẽ nhất. Để khắc phục tình trạng mụn sưng viêm mà không làm da bị kích ứng, hãy áp dụng quy trình skincare tối giản gồm 5 bước sau:</p><h4>Bước 1: Tẩy trang sạch sâu</h4><p>Dù có trang điểm hay không, bạn vẫn cần tẩy trang vào buổi tối để hòa tan lớp kem chống nắng, dầu thừa và bụi mịn bám chặt trên da suốt cả ngày.</p><h4>Bước 2: Sữa rửa mặt dịu nhẹ</h4><p>Nên chọn dòng sữa rửa mặt có độ pH cân bằng 5.5, chứa Salicylic Acid (BHA) giúp len lỏi sâu làm sạch dầu tắc nghẽn trong cổ nang lông.</p><h4>Bước 3: Nước hoa hồng cân bằng (Toner)</h4><p>Làm dịu da tức thì, phục hồi độ ẩm và chuẩn bị một lớp nền ẩm mượt để các bước dưỡng chất tiếp theo thẩm thấu tốt hơn.</p><h4>Bước 4: Serum trị mụn / Tinh chất đặc trị</h4><p>Thoa một lớp mỏng serum có thành phần Tea Tree Oil, Niacinamide hoặc BHA lên vùng da mụn để tiêu sưng kháng viêm.</p><h4>Bước 5: Kem dưỡng ẩm dạng gel mỏng nhẹ</h4><p>Khóa ẩm lại để ngăn hơi nước bốc hơi khỏi da. Chọn kết cấu dạng gel-cream mỏng nhẹ để tránh gây bít tắc nang lông sinh thêm nhân mụn mới.</p>', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 'b303493e-7833-4f9e-a89e-4e4f2081f212', timezone('utc'::text, now()), true);

INSERT INTO public.post_tags (post_id, tag_id) VALUES
('e303493e-7833-4f9e-a89e-4e4f2081f261', 'a103493e-7833-4f9e-a89e-4e4f2081f221'),
('e303493e-7833-4f9e-a89e-4e4f2081f261', 'a103493e-7833-4f9e-a89e-4e4f2081f222'),
('e303493e-7833-4f9e-a89e-4e4f2081f261', 'a103493e-7833-4f9e-a89e-4e4f2081f223'),
('e303493e-7833-4f9e-a89e-4e4f2081f262', 'a103493e-7833-4f9e-a89e-4e4f2081f224'),
('e303493e-7833-4f9e-a89e-4e4f2081f262', 'a103493e-7833-4f9e-a89e-4e4f2081f225');

-- Banners
INSERT INTO public.banners (id, title, image_url, link, sort_order, active) VALUES
('a303493e-7833-4f9e-a89e-4e4f2081f271', 'Mỹ Phẩm Nam Giới Cao Cấp', 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=1600&auto=format&fit=crop&q=80', '/collections/cham-soc-da-mat', 1, true),
('a303493e-7833-4f9e-a89e-4e4f2081f272', 'Định Hình Phong Cách Đàn Ông', 'https://images.unsplash.com/photo-1517832606589-7a598b389a03?w=1600&auto=format&fit=crop&q=80', '/blogs/news/xu-huong-long-may-nam-2018-khong-the-khong-biet', 2, true);

-- Settings
INSERT INTO public.settings (key, value, description) VALUES
('site_name', 'CoolBeauty Store', 'Tên thương hiệu website'),
('site_logo', '💄 CoolBeauty', 'Logo hiển thị text hoặc icon'),
('site_description', 'Hệ thống mỹ phẩm, sản phẩm trang điểm & chăm sóc sắc đẹp dành riêng cho phái mạnh và mọi giới tính.', 'Mô tả SEO website'),
('contact_email', 'support@coolbeauty.vn', 'Email hỗ trợ liên hệ'),
('contact_phone', '1900 6789', 'Số hotline liên hệ'),
('contact_address', '123 Đường Ba Tháng Hai, Quận 10, Thành phố Hồ Chí Minh', 'Địa chỉ cửa hàng'),
('facebook_url', 'https://facebook.com/coolbeauty', 'Link Fanpage Facebook'),
('instagram_url', 'https://instagram.com/coolbeauty', 'Link Instagram');
