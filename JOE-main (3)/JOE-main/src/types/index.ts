// ─────────────────────────────────────────────────────────────────────────────
// index.ts  –  Types aligned to the actual Supabase schema
//
// Key schema facts (confirmed from console errors + AdminDashboardPage):
//   orders        → customer_name, customer_phone (NOT NULL), customer_email,
//                   shipping_address, city, total_amount, status, payment_method
//   order_items   → id, order_id, product_id, product_title, size, color,
//                   quantity, price
//   products      → id, title, price, compare_at_price, description, image_url,
//                   category, category_name?, sizes, colors, featured, created_at
//   categories    → id, name_en, name_ar, slug, image_url, created_at
// ─────────────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  image_url: string;
  category: string;          // stores the category slug (FK reference)
  category_name?: string;    // optional denormalised display name
  category_id?: string | null;
  sizes: string;             // comma-separated TEXT column, e.g. "S,M,L,XL"
  colors: string;            // comma-separated TEXT column, e.g. "Black,White"
  featured: boolean;
  stock?: number;
  slug?: string;
  created_at: string;

  // ── Legacy / alias fields kept for backwards-compat with older code ──────
  /** @deprecated Use `title` instead */
  name?: string;
  /** @deprecated Use `image_url` instead */
  image?: string;
  /** @deprecated Use `image_url` instead */
  images?: string;
  /** @deprecated Use `featured` instead */
  is_featured?: boolean;
}

// ---------------------------------------------------------------------------
// Order – matches the `orders` table in Supabase exactly.
//
// IMPORTANT: the DB columns are  customer_phone / shipping_address / total_amount.
// Previous versions of this file used `phone`, `address`, `total_price` which
// caused NOT-NULL constraint violations and 400 errors on insert / select.
// ---------------------------------------------------------------------------
export interface Order {
  id: string;
  created_at: string;

  // Customer info
  customer_name: string;
  customer_phone: string;       // NOT NULL in DB – always required
  customer_email: string | null;

  // Shipping
  shipping_address: string;     // DB column name (was `address` – now fixed)
  city: string | null;

  // Financials
  total_amount: number;         // DB column name (was `total_price` – now fixed)

  // Order meta
  status: 'Pending' | 'Shipped' | 'Completed';
  payment_method: string | null;

  // Joined relation (populated client-side or via Supabase join)
  items?: OrderItem[];
}

// ---------------------------------------------------------------------------
// OrderItem – matches the `order_items` table exactly.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// CartItem – client-only, not persisted directly
// ---------------------------------------------------------------------------
export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

// ---------------------------------------------------------------------------
// Category – matches the `categories` table exactly.
// ---------------------------------------------------------------------------
export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Safely split a comma-separated TEXT column into a trimmed, non-empty array. */
export function splitList(
  value: string | undefined | null,
  fallback: string[] = [],
): string[] {
  if (!value || typeof value !== 'string') return fallback;
  return value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Build the minimal insert/update payload for the `orders` table.
 * Keeps column names in sync with the DB so callers never mis-map fields.
 */
export function buildOrderPayload(params: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  shipping_address: string;
  city?: string | null;
  total_amount: number;
  status?: Order['status'];
  payment_method?: string | null;
}): Omit<Order, 'id' | 'created_at' | 'items'> {
  return {
    customer_name: params.customer_name,
    customer_phone: params.customer_phone,             // NOT NULL – must be provided
    customer_email: params.customer_email ?? null,
    shipping_address: params.shipping_address,
    city: params.city ?? null,
    total_amount: params.total_amount,
    status: params.status ?? 'Pending',
    payment_method: params.payment_method ?? null,
  };
}
