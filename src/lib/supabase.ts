// Trigger Vercel rebuild with env vars
import { createClient } from '@supabase/supabase-js';
import { 
  mockCategories, 
  mockTags, 
  mockProductCategories, 
  mockProducts, 
  mockPosts, 
  mockBanners, 
  mockSettings 
} from './mockData';
import { Post, Product, Category, ProductCategory, Tag, Banner, Setting, Order } from '@/types';

// In-memory data store for local session mock operations (so CMS works!)
let localProducts = [...mockProducts];
let localPosts = [...mockPosts];
const localCategories = [...mockCategories];
const localProductCategories = [...mockProductCategories];
const localTags = [...mockTags];
let localBanners = [...mockBanners];
const localSettings = [...mockSettings];
const localOrders: Order[] = [];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Determine if we have valid non-placeholder keys
const hasSupabase = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder');

export const supabase = hasSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Unified DB Service that handles API requests via Supabase or in-memory Mock
export const dbService = {
  // PRODUCTS
  async getProducts(options?: { categorySlug?: string; featured?: boolean; search?: string }) {
    if (supabase) {
      try {
        let query = supabase.from('products').select('*, product_categories(*), product_images(*)');
        if (options?.featured) query = query.eq('featured', true);
        if (options?.search) query = query.ilike('name', `%${options.search}%`);
        const { data, error } = await query;
        if (!error && data) {
          // Map to correct casing/types
          return data as Product[];
        }
      } catch (e) {
        console.error('Supabase query error, falling back to mock:', e);
      }
    }
    
    // Mock fallback
    let list = [...localProducts];
    if (options?.featured) {
      list = list.filter(p => p.featured);
    }
    if (options?.categorySlug) {
      list = list.filter(p => p.product_categories?.slug === options.categorySlug);
    }
    if (options?.search) {
      const s = options.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || (p.description && p.description.toLowerCase().includes(s)));
    }
    return list;
  },

  async getProductBySlug(slug: string) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_categories(*), product_images(*)')
          .eq('slug', slug)
          .single();
        if (!error && data) return data as Product;
      } catch (e) {
        console.error(e);
      }
    }
    return localProducts.find(p => p.slug === slug) || null;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at'>, images: string[]) {
    if (supabase) {
      try {
        const { data: newProd, error } = await supabase
          .from('products')
          .insert([{ ...product }])
          .select()
          .single();
        
        if (!error && newProd) {
          if (images.length > 0) {
            const imgInserts = images.map((url, i) => ({
              product_id: newProd.id,
              image_url: url,
              sort_order: i + 1
            }));
            await supabase.from('product_images').insert(imgInserts);
          }
          return newProd as Product;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Mock implementation
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      product_categories: localProductCategories.find(c => c.id === product.category_id),
      product_images: images.map((url, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        product_id: '',
        image_url: url,
        sort_order: i + 1,
        created_at: ''
      }))
    };
    localProducts.unshift(newProduct);
    return newProduct;
  },

  async deleteProduct(id: string) {
    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
        return true;
      } catch (e) {
        console.error(e);
      }
    }
    localProducts = localProducts.filter(p => p.id !== id);
    return true;
  },

  async updateProduct(id: string, product: Omit<Product, 'id' | 'created_at'>, images: string[]) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ ...product })
          .eq('id', id);
        
        if (!error) {
          if (images.length > 0) {
            await supabase.from('product_images').delete().eq('product_id', id);
            const imgInserts = images.map((url, i) => ({
              product_id: id,
              image_url: url,
              sort_order: i + 1
            }));
            await supabase.from('product_images').insert(imgInserts);
          }
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const index = localProducts.findIndex(p => p.id === id);
    if (index > -1) {
      localProducts[index] = {
        ...localProducts[index],
        ...product,
        product_categories: localProductCategories.find(c => c.id === product.category_id),
        product_images: images.map((url, i) => ({
          id: Math.random().toString(36).substr(2, 9),
          product_id: id,
          image_url: url,
          sort_order: i + 1,
          created_at: ''
        }))
      };
    }
    return true;
  },

  // PRODUCT CATEGORIES
  async getProductCategories() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('product_categories').select('*');
        if (!error && data) return data as ProductCategory[];
      } catch (e) {
        console.error(e);
      }
    }
    return localProductCategories;
  },

  async createProductCategory(category: Omit<ProductCategory, 'id' | 'created_at'>) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('product_categories').insert([category]).select().single();
        if (!error && data) return data as ProductCategory;
      } catch (e) {
        console.error(e);
      }
    }
    const newCat: ProductCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    localProductCategories.push(newCat);
    return newCat;
  },

  // POSTS (BLOGS)
  async getPosts(options?: { categorySlug?: string; tagSlug?: string; search?: string; limit?: number }) {
    if (supabase) {
      try {
        let query = supabase.from('posts').select('*, categories(*), post_tags(*, tags(*))').eq('is_published', true);
        if (options?.search) query = query.ilike('title', `%${options.search}%`);
        const { data, error } = await query;
        if (!error && data) {
          let list = data as Post[];
          if (options?.categorySlug) {
            list = list.filter(p => p.categories?.slug === options.categorySlug);
          }
          if (options?.tagSlug) {
            list = list.filter(p => p.post_tags?.some(pt => pt.tags?.slug === options.tagSlug));
          }
          if (options?.limit) {
            list = list.slice(0, options.limit);
          }
          return list;
        }
      } catch (e) {
        console.error(e);
      }
    }

    let list = [...localPosts];
    if (options?.search) {
      const s = options.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || (p.summary && p.summary.toLowerCase().includes(s)));
    }
    if (options?.categorySlug) {
      list = list.filter(p => p.categories?.slug === options.categorySlug);
    }
    if (options?.tagSlug) {
      list = list.filter(p => p.post_tags?.some(pt => pt.tags?.slug === options.tagSlug));
    }
    if (options?.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  },

  async getPostBySlug(slug: string) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*, categories(*), post_tags(*, tags(*))')
          .eq('slug', slug)
          .single();
        if (!error && data) return data as Post;
      } catch (e) {
        console.error(e);
      }
    }
    return localPosts.find(p => p.slug === slug) || null;
  },

  async createPost(post: Omit<Post, 'id' | 'created_at'>, tagIds: string[]) {
    if (supabase) {
      try {
        const { data: newPost, error } = await supabase
          .from('posts')
          .insert([{ ...post }])
          .select()
          .single();
        if (!error && newPost) {
          if (tagIds.length > 0) {
            const tagInserts = tagIds.map(tId => ({
              post_id: newPost.id,
              tag_id: tId
            }));
            await supabase.from('post_tags').insert(tagInserts);
          }
          return newPost as Post;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const newP: Post = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      categories: localCategories.find(c => c.id === post.category_id),
      post_tags: tagIds.map(tId => ({
        tag_id: tId,
        tags: localTags.find(t => t.id === tId)!
      })).filter(t => !!t.tags)
    };
    localPosts.unshift(newP);
    return newP;
  },

  async deletePost(id: string) {
    if (supabase) {
      try {
        await supabase.from('posts').delete().eq('id', id);
        return true;
      } catch (e) {
        console.error(e);
      }
    }
    localPosts = localPosts.filter(p => p.id !== id);
    return true;
  },

  async updatePost(id: string, post: Omit<Post, 'id' | 'created_at'>, tagIds: string[]) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('posts')
          .update({ ...post })
          .eq('id', id);
        
        if (!error) {
          await supabase.from('post_tags').delete().eq('post_id', id);
          if (tagIds.length > 0) {
            const tagInserts = tagIds.map(tId => ({
              post_id: id,
              tag_id: tId
            }));
            await supabase.from('post_tags').insert(tagInserts);
          }
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const index = localPosts.findIndex(p => p.id === id);
    if (index > -1) {
      localPosts[index] = {
        ...localPosts[index],
        ...post,
        categories: localCategories.find(c => c.id === post.category_id),
        post_tags: tagIds.map(tId => ({
          tag_id: tId,
          tags: localTags.find(t => t.id === tId)!
        })).filter(t => !!t.tags)
      };
    }
    return true;
  },

  // POST CATEGORIES
  async getCategories() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data) return data as Category[];
      } catch (e) {
        console.error(e);
      }
    }
    return localCategories;
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('categories').insert([category]).select().single();
        if (!error && data) return data as Category;
      } catch (e) {
        console.error(e);
      }
    }
    const newCat: Category = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    localCategories.push(newCat);
    return newCat;
  },

  // TAGS
  async getTags() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('tags').select('*');
        if (!error && data) return data as Tag[];
      } catch (e) {
        console.error(e);
      }
    }
    return localTags;
  },

  async createTag(tag: Omit<Tag, 'id' | 'created_at'>) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('tags').insert([tag]).select().single();
        if (!error && data) return data as Tag;
      } catch (e) {
        console.error(e);
      }
    }
    const newTag: Tag = {
      ...tag,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    localTags.push(newTag);
    return newTag;
  },

  // BANNERS
  async getBanners() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('banners').select('*').eq('active', true).order('sort_order', { ascending: true });
        if (!error && data) return data as Banner[];
      } catch (e) {
        console.error(e);
      }
    }
    return localBanners.filter(b => b.active).sort((a, b) => a.sort_order - b.sort_order);
  },

  async createBanner(banner: Omit<Banner, 'id' | 'created_at'>) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('banners')
          .insert([{ ...banner }])
          .select()
          .single();
        if (!error && data) return data as Banner;
      } catch (e) {
        console.error(e);
      }
    }
    const newB: Banner = {
      ...banner,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    localBanners.push(newB);
    return newB;
  },

  async deleteBanner(id: string) {
    if (supabase) {
      try {
        await supabase.from('banners').delete().eq('id', id);
        return true;
      } catch (e) {
        console.error(e);
      }
    }
    localBanners = localBanners.filter(b => b.id !== id);
    return true;
  },

  async updateBanner(id: string, banner: Omit<Banner, 'id' | 'created_at'>) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('banners')
          .update({ ...banner })
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error(e);
      }
    }
    const index = localBanners.findIndex(b => b.id === id);
    if (index > -1) {
      localBanners[index] = {
        ...localBanners[index],
        ...banner
      };
    }
    return true;
  },

  // SETTINGS
  async getSettings() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('settings').select('*');
        if (!error && data) return data as Setting[];
      } catch (e) {
        console.error(e);
      }
    }
    return localSettings;
  },

  async updateSetting(key: string, value: string) {
    if (supabase) {
      try {
        await supabase.from('settings').update({ value }).eq('key', key);
        return true;
      } catch (e) {
        console.error(e);
      }
    }
    const settingIndex = localSettings.findIndex(s => s.key === key);
    if (settingIndex > -1) {
      localSettings[settingIndex].value = value;
    }
    return true;
  },

  // ORDERS
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'status'>, items: { product_id: string; quantity: number; price: number }[]) {
    if (supabase) {
      try {
        const { data: newOrder, error } = await supabase
          .from('orders')
          .insert([{ ...order, status: 'pending' }])
          .select()
          .single();

        if (error) {
          console.error('Supabase Order Insert Error:', error);
        }

        if (!error && newOrder) {
          const itemInserts = items.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          }));
          const { error: itemsError } = await supabase.from('order_items').insert(itemInserts);
          if (itemsError) {
            console.error('Supabase Order Items Insert Error:', itemsError);
          }
          return newOrder as Order;
        }
      } catch (e) {
        console.error('Catch error inserting order:', e);
      }
    }

    const newO: Order = {
      ...order,
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString(),
      order_items: items.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        order_id: '',
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        products: localProducts.find(p => p.id === item.product_id)
      }))
    };
    localOrders.unshift(newO);
    return newO;
  },

  async getOrders() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Order[];
      } catch (e) {
        console.error(e);
      }
    }
    return localOrders;
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    if (supabase) {
      try {
        await supabase.from('orders').update({ status }).eq('id', id);
        return true;
      } catch (e) {
        console.error(e);
      }
    }
    const order = localOrders.find(o => o.id === id);
    if (order) {
      order.status = status;
    }
    return true;
  },

  async uploadImage(file: File): Promise<string> {
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (!error) {
          const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);
          return publicUrlData.publicUrl;
        } else {
          console.error('Supabase upload error:', error);
        }
      } catch (e) {
        console.error('Catch upload error:', e);
      }
    }
    
    // Mock local base64 preview (fallback)
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
};
