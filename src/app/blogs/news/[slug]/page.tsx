'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { dbService } from '@/lib/supabase';
import { Post } from '@/types';
import { Calendar, User, ChevronRight, Tag } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPostDetails() {
      setLoading(true);
      const dbPost = await dbService.getPostBySlug(slug);
      if (dbPost) {
        setPost(dbPost);
        // Load related posts from same category
        if (dbPost.category_id) {
          const list = await dbService.getPosts({ limit: 4 });
          setRelatedPosts(list.filter(p => p.id !== dbPost.id && p.category_id === dbPost.category_id));
        }
      }
      setLoading(false);
    }
    loadPostDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-6 w-48 bg-gray-100 rounded-md" />
        <div className="h-12 w-3/4 bg-gray-100 rounded-md" />
        <div className="h-[400px] bg-gray-100 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-100 rounded-md" />
          <div className="h-4 bg-gray-100 rounded-md" />
          <div className="h-4 w-5/6 bg-gray-100 rounded-md" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy bài viết</h2>
        <p className="text-gray-500 font-light">Bài viết này không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link href="/blogs" className="inline-block bg-primary text-white px-6 py-3 rounded-full text-xs font-semibold">
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 flex items-center space-x-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blogs" className="hover:text-primary">Tin Tức</Link>
        {post.categories && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/blogs?category=${post.categories.slug}`} className="hover:text-primary">
              {post.categories.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 font-semibold line-clamp-1">{post.title}</span>
      </nav>

      {/* Main post layout */}
      <article className="space-y-6">
        
        {/* Title & Metadata */}
        <div className="space-y-3">
          {post.categories && (
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {post.categories.name}
            </span>
          )}
          <h1 className="text-2xl md:text-4xl font-bold font-serif text-gray-950 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium">
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : ''}</span>
            <span>•</span>
            <span className="flex items-center"><User className="w-4 h-4 mr-1" /> Admin</span>
          </div>
        </div>

        {/* Featured image */}
        {post.image_url && (
          <div className="aspect-video relative rounded-2xl overflow-hidden shadow-md">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* HTML Article content */}
        <div 
          className="prose max-w-none font-light text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.post_tags && post.post_tags.length > 0 && (
          <div className="flex items-center space-x-2 pt-6 border-t border-gray-100">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-semibold">Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {post.post_tags.map(pt => (
                <Link
                  key={pt.tag_id}
                  href={`/blogs?tag=${pt.tags?.slug}`}
                  className="text-[10px] bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium"
                >
                  #{pt.tags?.name}
                </Link>
              ))}
            </div>
          </div>
        )}

      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="pt-12 border-t border-gray-100 space-y-6">
          <h3 className="text-lg font-bold font-serif text-gray-950">Bài viết liên quan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.slice(0, 3).map(relPost => (
              <div key={relPost.id} className="group space-y-3">
                <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-50">
                  <img 
                    src={relPost.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'} 
                    alt={relPost.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="font-bold text-sm text-gray-950 line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/blogs/news/${relPost.slug}`}>{relPost.title}</Link>
                </h4>
                <p className="text-xs text-gray-400">{relPost.published_at ? new Date(relPost.published_at).toLocaleDateString('vi-VN') : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
