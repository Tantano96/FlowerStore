'use client';

import React, { useState, useEffect } from 'react';
import { dbService, supabase } from '@/lib/supabase';
import { Post, Product, Order, Banner, Setting } from '@/types';
import { LayoutDashboard, ShoppingCart, FileText, Settings, Image as ImageIcon, Trash2, Plus, LogOut } from 'lucide-react';
import { marked } from 'marked';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // CMS Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'posts' | 'orders' | 'banners' | 'settings'>('dashboard');

  // Load Database Items
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);

  // Editor forms states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // New Product Form
  const [newProdName, setNewProdName] = useState('');
  const [newProdSlug, setNewProdSlug] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCompare, setNewProdCompare] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdImagesList, setNewProdImagesList] = useState<string[]>([]);
  const [newProdSku, setNewProdSku] = useState('');

  // New Post Form
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostSlug, setNewPostSlug] = useState('');
  const [newPostSummary, setNewPostSummary] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [postPreviewMode, setPostPreviewMode] = useState<'edit' | 'preview'>('edit');

  // New Banner Form
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');
  const [newBannerOrder, setNewBannerOrder] = useState('1');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    // Check if logged in in this session
    const logged = localStorage.getItem('coolbeauty_admin_logged');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadCmsData();
    }
  }, [isLoggedIn]);

  async function loadCmsData() {
    const [dbProds, dbPosts, dbOrders, dbBanners, dbSettings] = await Promise.all([
      dbService.getProducts(),
      dbService.getPosts(),
      dbService.getOrders(),
      dbService.getBanners(),
      dbService.getSettings()
    ]);
    setProducts(dbProds);
    setPosts(dbPosts);
    setOrders(dbOrders);
    setBanners(dbBanners);
    setSettings(dbSettings);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (supabase) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (!authError && data.user) {
          setIsLoggedIn(true);
          localStorage.setItem('coolbeauty_admin_logged', 'true');
          return;
        }
      } catch (err) {
        console.error('Supabase Auth error:', err);
      }
    }

    // Fallback to local demo credentials
    if (email === 'admin@coolbeauty.vn' && password === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('coolbeauty_admin_logged', 'true');
    } else {
      setError('Sai email hoặc mật khẩu đăng nhập!');
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    localStorage.removeItem('coolbeauty_admin_logged');
  };

  // Add Product Form submit
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prod = {
      name: newProdName,
      slug: newProdSlug || newProdName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      description: newProdDesc,
      price: parseFloat(newProdPrice) || 0,
      compare_at_price: parseFloat(newProdCompare) || undefined,
      sku: newProdSku || undefined,
      stock: 100,
      featured: true
    };
    if (editingProduct) {
      await dbService.updateProduct(editingProduct.id, prod, newProdImagesList);
    } else {
      await dbService.createProduct(prod, newProdImagesList);
    }
    setShowAddProduct(false);
    setEditingProduct(null);
    loadCmsData();
    // clear fields
    setNewProdName('');
    setNewProdSlug('');
    setNewProdPrice('');
    setNewProdCompare('');
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdImagesList([]);
    setNewProdSku('');
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setNewProdName(prod.name);
    setNewProdSlug(prod.slug);
    setNewProdPrice(prod.price.toString());
    setNewProdCompare(prod.compare_at_price?.toString() || '');
    setNewProdDesc(prod.description || '');
    setNewProdImage('');
    setNewProdImagesList(prod.product_images?.map(img => img.image_url) || []);
    setNewProdSku(prod.sku || '');
    setShowAddProduct(true);
  };

  const handleCancelProductEdit = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
    setNewProdName('');
    setNewProdSlug('');
    setNewProdPrice('');
    setNewProdCompare('');
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdImagesList([]);
    setNewProdSku('');
  };

  // Add Post Form submit
  const handleAddPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const htmlContent = marked.parse(newPostContent);
    const postData = {
      title: newPostTitle,
      slug: newPostSlug || newPostTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      summary: newPostSummary,
      content: typeof htmlContent === 'string' ? htmlContent : await htmlContent,
      image_url: newPostImage || undefined,
      is_published: true,
      published_at: new Date().toISOString()
    };
    if (editingPost) {
      await dbService.updatePost(editingPost.id, postData, []);
    } else {
      await dbService.createPost(postData, []);
    }
    setShowAddPost(false);
    setEditingPost(null);
    loadCmsData();
    // clear fields
    setNewPostTitle('');
    setNewPostSlug('');
    setNewPostSummary('');
    setNewPostContent('');
    setNewPostImage('');
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setNewPostTitle(post.title);
    setNewPostSlug(post.slug);
    setNewPostSummary(post.summary || '');
    setNewPostContent(post.content);
    setNewPostImage(post.image_url || '');
    setShowAddPost(true);
  };

  const handleCancelPostEdit = () => {
    setShowAddPost(false);
    setEditingPost(null);
    setNewPostTitle('');
    setNewPostSlug('');
    setNewPostSummary('');
    setNewPostContent('');
    setNewPostImage('');
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      await dbService.deleteProduct(id);
      loadCmsData();
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa bài viết này?')) {
      await dbService.deletePost(id);
      loadCmsData();
    }
  };

  const handleAddBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const banner = {
      title: newBannerTitle,
      image_url: newBannerImage,
      link_url: newBannerLink || undefined,
      sort_order: parseInt(newBannerOrder) || 1,
      active: true
    };
    if (editingBanner) {
      await dbService.updateBanner(editingBanner.id, banner);
    } else {
      await dbService.createBanner(banner);
    }
    setShowAddBanner(false);
    setEditingBanner(null);
    loadCmsData();
    // clear fields
    setNewBannerTitle('');
    setNewBannerImage('');
    setNewBannerLink('');
    setNewBannerOrder('1');
  };

  const handleEditBanner = (b: Banner) => {
    setEditingBanner(b);
    setNewBannerTitle(b.title || '');
    setNewBannerImage(b.image_url);
    setNewBannerLink(b.link_url || '');
    setNewBannerOrder(b.sort_order.toString());
    setShowAddBanner(true);
  };

  const handleCancelBannerEdit = () => {
    setShowAddBanner(false);
    setEditingBanner(null);
    setNewBannerTitle('');
    setNewBannerImage('');
    setNewBannerLink('');
    setNewBannerOrder('1');
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
      await dbService.deleteBanner(id);
      loadCmsData();
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    await dbService.updateOrderStatus(id, status);
    loadCmsData();
  };

  const handleSettingChange = async (key: string, value: string) => {
    await dbService.updateSetting(key, value);
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-32 space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <span className="text-3xl">🔑</span>
            <h2 className="text-xl font-bold font-serif text-gray-900">Admin Login CMS</h2>
            <p className="text-xs text-gray-400 font-light">Vui lòng đăng nhập bằng tài khoản quản trị</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Email đăng nhập</label>
              <input
                type="email"
                required
                placeholder="admin@coolbeauty.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary text-sm outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Mật khẩu</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary text-sm outline-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-opacity-95 transition-all text-center flex items-center justify-center btn-premium"
            >
              ĐĂNG NHẬP
            </button>
            <div className="text-center pt-2 text-[10px] text-gray-400">
              Gợi ý tài khoản demo: <span className="font-semibold text-gray-600">admin@coolbeauty.vn / admin123</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-950 font-serif">CMS Quản Trị</h3>
                <span className="text-[10px] text-green-600 font-semibold">● Đang hoạt động</span>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 rounded-md transition-colors" title="Đăng xuất">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-1">
              {[
                { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
                { id: 'products', label: 'Quản lý sản phẩm', icon: ShoppingCart },
                { id: 'posts', label: 'Quản lý bài viết', icon: FileText },
                { id: 'orders', label: 'Quản lý đơn hàng', icon: ShoppingCart },
                { id: 'banners', label: 'Banners', icon: ImageIcon },
                { id: 'settings', label: 'Cấu hình website', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as 'dashboard' | 'products' | 'posts' | 'orders' | 'banners' | 'settings');
                      setShowAddProduct(false);
                      setShowAddPost(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* CMS Tab Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Active Tab: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-serif text-gray-950">Tổng Quan Hệ Thống</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: 'Tổng sản phẩm', value: products.length, desc: 'Sản phẩm đang bán', color: 'border-blue-500' },
                  { title: 'Bài viết tin tức', value: posts.length, desc: 'Bài viết trên blog', color: 'border-green-500' },
                  { title: 'Tổng đơn hàng', value: orders.length, desc: 'Đơn đã đặt hàng', color: 'border-amber-500' },
                  { title: 'Banners hoạt động', value: banners.length, desc: 'Ảnh trượt trang chủ', color: 'border-rose-500' }
                ].map((stat, i) => (
                  <div key={i} className={`bg-white p-5 rounded-2xl border-l-4 ${stat.color} shadow-sm space-y-2`}>
                    <span className="text-xs text-gray-500 font-medium">{stat.title}</span>
                    <p className="text-2xl font-bold text-gray-950 font-mono">{stat.value}</p>
                    <span className="text-[10px] text-gray-400 font-light block">{stat.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Tab: Products List & Forms */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-gray-950">Quản Lý Sản Phẩm</h2>
                {!showAddProduct && (
                  <button onClick={() => setShowAddProduct(true)} className="bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 hover:bg-opacity-95 shadow-sm">
                    <Plus className="w-4 h-4" /> <span>Thêm sản phẩm</span>
                  </button>
                )}
              </div>

              {showAddProduct ? (
                <form onSubmit={handleAddProductSubmit} className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                    {editingProduct ? 'CẬP NHẬT SẢN PHẨM' : 'THÊM SẢN PHẨM MỚI'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Tên sản phẩm *</label>
                      <input type="text" required value={newProdName} onChange={e => setNewProdName(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Slug (Đường dẫn tĩnh)</label>
                      <input type="text" value={newProdSlug} onChange={e => setNewProdSlug(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Giá bán (VND) *</label>
                      <input type="number" required value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Giá gốc gốc so sánh (VND)</label>
                      <input type="number" value={newProdCompare} onChange={e => setNewProdCompare(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">SKU sản phẩm</label>
                      <input type="text" value={newProdSku} onChange={e => setNewProdSku(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Hình ảnh sản phẩm (Nhiều ảnh)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 font-light block">Tải thêm ảnh từ thiết bị:</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await dbService.uploadImage(file);
                              setNewProdImagesList([...newProdImagesList, url]);
                            }
                          }}
                          className="w-full p-2 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" 
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 font-light block">Hoặc dán URL liên kết ảnh:</span>
                        <div className="flex space-x-2">
                          <input 
                            type="url" 
                            value={newProdImage} 
                            onChange={e => setNewProdImage(e.target.value)} 
                            placeholder="https://..."
                            className="flex-1 p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" 
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              if (newProdImage.trim()) {
                                setNewProdImagesList([...newProdImagesList, newProdImage.trim()]);
                                setNewProdImage('');
                              }
                            }}
                            className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-opacity-90"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                    {newProdImagesList.length > 0 && (
                      <div className="pt-3">
                        <span className="text-[10px] text-gray-400 font-light block mb-2">Danh sách ảnh đã chọn ({newProdImagesList.length}):</span>
                        <div className="flex flex-wrap gap-3">
                          {newProdImagesList.map((imgUrl, idx) => (
                            <div key={idx} className="relative w-16 h-16 border border-gray-200 rounded-md overflow-hidden group">
                              <img src={imgUrl} alt="Prod Image" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setNewProdImagesList(newProdImagesList.filter((_, i) => i !== idx))}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4.5 h-4.5 text-[8px] flex items-center justify-center hover:bg-red-600 shadow-sm"
                                title="Xóa ảnh này"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Mô tả sản phẩm</label>
                    <textarea rows={4} value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none resize-none" />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-opacity-95 shadow-sm">Lưu lại</button>
                    <button type="button" onClick={handleCancelProductEdit} className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-50">Hủy</button>
                  </div>
                </form>
              ) : (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                        <th className="p-4">Ảnh</th>
                        <th className="p-4">Tên sản phẩm</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Giá bán</th>
                        <th className="p-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-gray-50/50">
                          <td className="p-4">
                            <img src={prod.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=50'} alt="Img" className="w-10 h-10 object-cover rounded-md border border-gray-200" />
                          </td>
                          <td className="p-4 font-semibold text-gray-900">{prod.name}</td>
                          <td className="p-4 text-gray-500">{prod.sku || 'N/A'}</td>
                          <td className="p-4 font-mono font-semibold">{prod.price.toLocaleString('vi-VN')}đ</td>
                          <td className="p-4 text-right flex justify-end space-x-2">
                            <button onClick={() => handleEditProduct(prod)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-primary rounded-md transition-colors" title="Sửa">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                              </svg>
                            </button>
                            <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Active Tab: Posts List & Rich Forms */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-gray-950">Quản Lý Bài Viết</h2>
                {!showAddPost && (
                  <button onClick={() => setShowAddPost(true)} className="bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 hover:bg-opacity-95 shadow-sm">
                    <Plus className="w-4 h-4" /> <span>Viết bài mới</span>
                  </button>
                )}
              </div>

              {showAddPost ? (
                <form onSubmit={handleAddPostSubmit} className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                    {editingPost ? 'CẬP NHẬT BÀI VIẾT' : 'BÀI VIẾT MỚI'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Tiêu đề bài viết *</label>
                      <input type="text" required value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Slug bài viết</label>
                      <input type="text" value={newPostSlug} onChange={e => setNewPostSlug(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">Hình ảnh bài viết</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-light block">Tải từ thiết bị:</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await dbService.uploadImage(file);
                                setNewPostImage(url);
                              }
                            }}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-light block">Hoặc dán URL liên kết ảnh:</span>
                          <input 
                            type="url" 
                            value={newPostImage} 
                            onChange={e => setNewPostImage(e.target.value)} 
                            placeholder="https://..."
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" 
                          />
                        </div>
                      </div>
                      {newPostImage && (
                        <div className="pt-2">
                          <span className="text-[10px] text-gray-400 font-light block mb-1">Xem trước:</span>
                          <img src={newPostImage} alt="Preview" className="w-20 h-12 object-cover rounded-md border border-gray-200" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Tóm tắt ngắn</label>
                      <input type="text" value={newPostSummary} onChange={e => setNewPostSummary(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <label className="text-xs font-bold text-gray-700">Nội dung bài viết (Markdown / HTML)</label>
                      <div className="flex border border-gray-200 rounded-md overflow-hidden">
                        <button type="button" onClick={() => setPostPreviewMode('edit')} className={`px-3 py-1 text-[10px] font-semibold ${postPreviewMode === 'edit' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}>Soạn thảo</button>
                        <button type="button" onClick={() => setPostPreviewMode('preview')} className={`px-3 py-1 text-[10px] font-semibold ${postPreviewMode === 'preview' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}>Xem trước (Preview)</button>
                      </div>
                    </div>

                    {postPreviewMode === 'edit' ? (
                      <textarea rows={8} placeholder="Nhập nội dung bài viết bằng Markdown..." value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="w-full p-3 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none font-mono resize-y" />
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 max-h-[300px] overflow-y-auto prose max-w-none text-xs" dangerouslySetInnerHTML={{ __html: marked.parse(newPostContent) }} />
                    )}
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-opacity-95 shadow-sm">Lưu lại</button>
                    <button type="button" onClick={handleCancelPostEdit} className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-50">Hủy</button>
                  </div>
                </form>
              ) : (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                        <th className="p-4">Ảnh</th>
                        <th className="p-4">Tiêu đề bài viết</th>
                        <th className="p-4">Ngày tạo</th>
                        <th className="p-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {posts.map(post => (
                        <tr key={post.id} className="hover:bg-gray-50/50">
                          <td className="p-4">
                            <img src={post.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=50'} alt="Img" className="w-10 h-6 object-cover rounded-md border border-gray-200" />
                          </td>
                          <td className="p-4 font-semibold text-gray-900 max-w-xs truncate">{post.title}</td>
                          <td className="p-4 text-gray-500">{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
                          <td className="p-4 text-right flex justify-end space-x-2">
                            <button onClick={() => handleEditPost(post)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-primary rounded-md transition-colors" title="Sửa">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                              </svg>
                            </button>
                            <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Active Tab: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-serif text-gray-950">Quản Lý Đơn Hàng</h2>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Chưa có đơn hàng nào được đặt.</div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                        <th className="p-4">Khách hàng</th>
                        <th className="p-4">Số điện thoại / Địa chỉ</th>
                        <th className="p-4">Tổng tiền</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4 text-right">Cập nhật</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                          <td className="p-4 font-semibold text-gray-900">
                            <div>{order.customer_name}</div>
                            <span className="text-[10px] text-gray-400 font-mono font-light">{order.id}</span>
                          </td>
                          <td className="p-4 text-gray-600">
                            <div>{order.customer_phone}</div>
                            <div className="text-[10px] text-gray-400 line-clamp-1">{order.customer_address}</div>
                          </td>
                          <td className="p-4 font-mono font-semibold text-primary">{order.total_amount.toLocaleString('vi-VN')}đ</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                              order.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                              order.status === 'completed' ? 'bg-green-50 text-green-600' :
                              'bg-gray-50 text-gray-600'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="p-1 border border-gray-200 rounded text-[10px] outline-none"
                            >
                              <option value="pending">Chờ xử lý</option>
                              <option value="processing">Đang đóng gói</option>
                              <option value="completed">Đã giao</option>
                              <option value="cancelled">Hủy đơn</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Active Tab: Banners */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-gray-950">Ảnh Banners Trang Chủ</h2>
                {!showAddBanner && (
                  <button onClick={() => setShowAddBanner(true)} className="bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 hover:bg-opacity-95 shadow-sm">
                    <Plus className="w-4 h-4" /> <span>Thêm Banner</span>
                  </button>
                )}
              </div>

              {showAddBanner ? (
                <form onSubmit={handleAddBannerSubmit} className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                    {editingBanner ? 'CẬP NHẬT BANNER' : 'THÊM BANNER MỚI'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Tiêu đề Banner *</label>
                      <input type="text" required value={newBannerTitle} onChange={e => setNewBannerTitle(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Thứ tự hiển thị (Số)</label>
                      <input type="number" required value={newBannerOrder} onChange={e => setNewBannerOrder(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">Hình ảnh Banner</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-light block">Tải từ thiết bị:</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await dbService.uploadImage(file);
                                setNewBannerImage(url);
                              }
                            }}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-light block">Hoặc dán URL ảnh:</span>
                          <input 
                            type="url" 
                            value={newBannerImage} 
                            onChange={e => setNewBannerImage(e.target.value)} 
                            placeholder="https://..."
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" 
                          />
                        </div>
                      </div>
                      {newBannerImage && (
                        <div className="pt-2">
                          <span className="text-[10px] text-gray-400 font-light block mb-1">Xem trước banner:</span>
                          <img src={newBannerImage} alt="Preview" className="w-full h-32 object-cover rounded-md border border-gray-200" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Đường dẫn liên kết (Link URL)</label>
                      <input type="text" value={newBannerLink} onChange={e => setNewBannerLink(e.target.value)} placeholder="/products/..." className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-opacity-95 shadow-sm">Lưu lại</button>
                    <button type="button" onClick={handleCancelBannerEdit} className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-50">Hủy</button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {banners.map(b => (
                    <div key={b.id} className="border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm flex flex-col justify-between">
                      <div>
                        <img src={b.image_url} alt="Banner" className="w-full h-44 object-cover" />
                        <div className="p-4">
                          <h4 className="text-xs font-bold text-gray-950 truncate">{b.title || 'Untitled Banner'}</h4>
                          <p className="text-[10px] text-gray-400 font-mono mt-1">Thứ tự hiển thị: {b.sort_order}</p>
                          {b.link_url && <p className="text-[10px] text-[#ff5258] truncate mt-1">Link: {b.link_url}</p>}
                        </div>
                      </div>
                      <div className="p-4 pt-0 flex justify-between items-center border-t border-gray-50 mt-2 bg-gray-50/50 py-3">
                        <span className="text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded">Hoạt động</span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditBanner(b)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary rounded transition-colors"
                            title="Sửa Banner"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteBanner(b.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Xóa Banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Tab: Settings Configuration */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-serif text-gray-950">Cấu Hình Website</h2>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                {settings.map(setting => (
                  <div key={setting.key} className="space-y-1 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800">{setting.key.toUpperCase().replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-gray-400">{setting.description}</span>
                    </div>
                    <input
                      type="text"
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
