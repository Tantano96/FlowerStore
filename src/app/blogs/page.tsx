'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { dbService } from '@/lib/supabase';
import { Post, Category, Tag } from '@/types';
import { Search, Calendar, User, ChevronRight } from 'lucide-react';

function BlogListContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const tagParam = searchParams.get('tag') || '';
  const searchParam = searchParams.get('search') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    async function loadBlogData() {
      setLoading(true);
      const [allPosts, allCats, allTags] = await Promise.all([
        dbService.getPosts(),
        dbService.getCategories(),
        dbService.getTags()
      ]);
      setCategories(allCats);
      setTags(allTags);

      let filtered = [...allPosts];

      if (categoryParam) {
        filtered = filtered.filter(p => p.categories?.slug === categoryParam);
      }
      if (tagParam) {
        filtered = filtered.filter(p => p.post_tags?.some(pt => pt.tags?.slug === tagParam));
      }
      if (searchParam) {
        const s = searchParam.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(s) || 
          (p.summary && p.summary.toLowerCase().includes(s))
        );
      }

      setPosts(filtered);
      setLoading(false);
    }
    loadBlogData();
  }, [categoryParam, tagParam, searchParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      window.location.href = `/blogs?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = '/blogs';
    }
  };

  // Pagination calculation
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const selectedCategory = categories.find(c => c.slug === categoryParam);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 flex items-center space-x-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blogs" className="hover:text-primary">Tin Tức</Link>
        {selectedCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600 font-semibold">{selectedCategory.name}</span>
          </>
        )}
        {tagParam && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600 font-semibold">Tag: #{tagParam}</span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold font-serif text-gray-950">Tin Tức & Blog</h1>
        <p className="text-sm text-gray-500 font-light">Xu hướng làm đẹp nam giới, cẩm nang chăm sóc da và phong cách sống.</p>
        <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Right side / Main content */}
        <main className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-500">Không tìm thấy bài viết nào.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentPosts.map(post => (
                  <article key={post.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video relative overflow-hidden bg-gray-50">
                      <img 
                        src={post.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500'} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-medium">
                          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : ''}</span>
                          <span>•</span>
                          <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> Admin</span>
                        </div>
                        <h3 className="font-bold font-serif text-lg text-gray-950 hover:text-primary transition-colors line-clamp-2">
                          <Link href={`/blogs/news/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>
                      <Link 
                        href={`/blogs/news/${post.slug}`} 
                        className="text-xs font-bold text-primary hover:text-opacity-80 transition-colors uppercase tracking-wider block"
                      >
                        Đọc tiếp &rarr;
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 pt-6">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                        currentPage === idx + 1 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {/* Left side / Sidebar Filters */}
        <aside className="space-y-8">
          
          {/* Search box */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">TÌM KIẾM BÀI VIẾT</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none text-xs bg-white"
              />
              <button type="submit" className="absolute right-3 top-3 text-gray-400 hover:text-primary">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Categories list */}
          <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">DANH MỤC BLOG</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link 
                  href="/blogs" 
                  className={`block py-1.5 transition-colors ${
                    !categoryParam ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Tất cả bài viết
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link 
                    href={`/blogs?category=${cat.slug}`} 
                    className={`block py-1.5 transition-colors ${
                      categoryParam === cat.slug ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags list */}
          <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">TAG NỔI BẬT</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <Link
                  key={t.id}
                  href={`/blogs?tag=${t.slug}`}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all ${
                    tagParam === t.slug 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}

export default function BlogListPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 animate-pulse">Đang tải bài viết...</div>}>
      <BlogListContent />
    </Suspense>
  );
}
