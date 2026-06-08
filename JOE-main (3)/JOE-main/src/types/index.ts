export interface Product {
  id: string;
  name?: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  image_url: string;
  image?: string;
  images?: string;
  category_id?: string | null;
  category: string;
  category_name?: string;
  sizes: string;
  colors: string;
  featured: boolean;
  is_featured?: boolean;
  stock?: number;
  slug?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  total_price: number;
  status: 'Pending' | 'Shipped' | 'Completed';
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

/** Safely split a comma-separated string (from DB TEXT columns) into an array. */
export function splitList(value: string | undefined | null, fallback: string[] = []): string[] {
  if (!value || typeof value !== 'string') return fallback;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}
