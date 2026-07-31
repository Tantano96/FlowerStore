export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  image_url?: string;
  category_id?: string;
  author_id?: string;
  published_at?: string;
  is_published: boolean;
  created_at: string;
  categories?: Category; // loaded relation
  post_tags?: { tag_id: string; tags: Tag }[]; // loaded tags
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  sku?: string;
  category_id?: string;
  stock: number;
  featured: boolean;
  created_at: string;
  product_categories?: ProductCategory; // loaded relation
  product_images?: ProductImage[]; // loaded images
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  notes?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  quantity: number;
  price: number;
  products?: Product;
}

export interface Banner {
  id: string;
  title?: string;
  image_url: string;
  link_url?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
  description?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
