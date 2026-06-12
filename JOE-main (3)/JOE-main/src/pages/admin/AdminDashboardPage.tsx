import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package, ShoppingBag, LogOut, Plus, Pencil, Trash2,
  X, Check, ArrowLeft, Tags, Upload, ImageIcon, Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang, type TKey } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import type { Product, OrderItem, Category } from '../../types';
import dashboardBg from '../../assets/admin-dashboard-bg.jpeg';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'orders' | 'products' | 'categories' | 'settings';
type OrderStatus = 'Pending' | 'Shipped' | 'Completed';
type AdminOrder = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  shipping_address: string;
  city: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_method: string | null;
  items: OrderItem[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ensureString(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.map(item => ensureString(item).trim()).filter(Boolean).join(', ');
  return String(val);
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

function normalizeProduct(raw: Record<string, unknown>): Product {
  return {
    ...raw,
    id: ensureString(raw.id),
    price: Number(raw.price) || 0,
    compare_at_price: raw.compare_at_price == null ? null : Number(raw.compare_at_price),
    sizes: ensureString(raw.sizes),
    colors: ensureString(raw.colors),
  } as Product;
}

function normalizeOrderStatus(value: unknown): OrderStatus {
  if (value === 'Shipped' || value === 'Completed') return value;
  return 'Pending';
}

function normalizeOrder(raw: Record<string, unknown>, items: OrderItem[] = []): AdminOrder {
  return {
    id: ensureString(raw.id),
    created_at: ensureString(raw.created_at),
    customer_name: ensureString(raw.customer_name),
    customer_email: raw.customer_email == null ? null : ensureString(raw.customer_email),
    customer_phone: ensureString(raw.customer_phone),
    shipping_address: ensureString(raw.shipping_address),
    city: raw.city == null ? null : ensureString(raw.city),
    total_amount: Number(raw.total_amount) || 0,
    status: normalizeOrderStatus(raw.status),
    payment_method: raw.payment_method == null ? null : ensureString(raw.payment_method),
    items,
  };
}

function normalizeOrderItem(raw: Record<string, unknown>): OrderItem {
  return {
    ...raw,
    id: ensureString(raw.id),
    order_id: ensureString(raw.order_id),
    product_id: raw.product_id == null ? null : ensureString(raw.product_id),
    quantity: Number(raw.quantity) || 0,
    price: Number(raw.price) || 0,
  } as OrderItem;
}

function normalizeCategory(raw: Record<string, unknown>): Category {
  return {
    ...raw,
    id: ensureString(raw.id),
    image_url: raw.image_url == null ? null : ensureString(raw.image_url),
  } as Category;
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

async function uploadImage(file: File, bucket: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const uniqueName = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(uniqueName, file, { upsert: false, contentType: file.type });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(uniqueName);
  return data.publicUrl;
}

// ─── Shared: ImageUploadField ─────────────────────────────────────────────────

function ImageUploadField({
  currentUrl,
  onUrlChange,
  uploading,
  onFileSelected,
  label,
}: {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  uploading: boolean;
  onFileSelected: (file: File) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{label}</label>

      {currentUrl && !uploading && (
        <div className="relative mb-2 w-full h-32 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
          <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onUrlChange('')}
            className="absolute top-1 right-1 p-1 bg-white/90 rounded-full hover:bg-red-50 text-neutral-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {uploading && (
        <div className="mb-2 flex items-center gap-2 text-sm text-sky-600 bg-sky-50 border border-sky-100 rounded-lg px-4 py-3">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full" />
          Uploading image…
        </div>
      )}

      {!currentUrl && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-neutral-200 rounded-lg px-4 py-6 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span className="text-sm">Click to upload image</span>
          <span className="text-xs">PNG, JPG, WEBP up to 10 MB</span>
        </button>
      )}

      {currentUrl && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" /> Replace image
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { t, formatPrice, lang } = useLang();
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) navigate('/admin/login', { replace: true });
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    if (tab === 'orders') fetchOrders();
    else if (tab === 'products') { fetchProducts(); fetchCategories(false); }
    else if (tab === 'categories') fetchCategories();
  }, [tab, isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: orderData, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at, customer_name, customer_email, customer_phone, shipping_address, city, total_amount, status, payment_method')
      .order('created_at', { ascending: false });

    if (ordersError) { setOrders([]); setLoading(false); return; }

    const { data: itemData } = await supabase
      .from('order_items')
      .select('id, order_id, product_id, product_title, size, color, quantity, price');

    const normalizedItems = (itemData || []).map(item => normalizeOrderItem(item as Record<string, unknown>));
    const itemsByOrder = normalizedItems.reduce<Record<string, OrderItem[]>>((acc, item) => {
      const orderId = String(item.order_id);
      if (!acc[orderId]) acc[orderId] = [];
      acc[orderId].push(item);
      return acc;
    }, {});

    setOrders((orderData || []).map(o => normalizeOrder(o as Record<string, unknown>, itemsByOrder[String(o.id)] || [])));
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) { setProducts([]); } else if (data) {
      setProducts(data.map(item => normalizeProduct(item as Record<string, unknown>)));
    }
    setLoading(false);
  };

  const fetchCategories = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name_en');
    if (error) { setCategories([]); } else if (data) {
      setCategories(data.map(item => normalizeCategory(item as Record<string, unknown>)));
    }
    if (showSpinner) setLoading(false);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const id = String(orderId);
    if (!isUuid(id)) { alert('Cannot update this order: invalid ID. Please refresh.'); return; }
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) { alert(`Failed to update order status: ${error.message}`); return; }
    setOrders(prev => prev.map(o => String(o.id) === id ? { ...o, status } : o));
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm(t('deleteOrderConfirm'))) return;
    const id = String(orderId);
    if (!isUuid(id)) { alert('Cannot delete this order: invalid ID. Please refresh.'); return; }
    const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', id);
    if (itemsError) { alert(`Failed to delete order items: ${itemsError.message}`); return; }
    const { error: orderError } = await supabase.from('orders').delete().eq('id', id);
    if (orderError) { alert(`Failed to delete order: ${orderError.message}`); return; }
    setOrders(prev => prev.filter(o => String(o.id) !== id));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(t('deleteProductConfirm'))) return;
    const productId = String(id);
    if (!isUuid(productId)) { alert('Cannot delete this product: invalid ID. Please refresh.'); return; }
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) { alert(`Failed to delete product: ${error.message}`); return; }
    setProducts(prev => prev.filter(p => String(p.id) !== productId));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (!isAdmin) return null;

  const tabButtons = [
    { key: 'orders' as Tab, icon: ShoppingBag, label: t('orders') },
    { key: 'products' as Tab, icon: Package, label: t('products') },
    { key: 'categories' as Tab, icon: Tags, label: t('categories') },
    { key: 'settings' as Tab, icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.88)), url(${dashboardBg})` }}
    >
      <header className="bg-white/95 backdrop-blur border-b border-neutral-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
            </Link>
            <span className="text-neutral-200">|</span>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              <span className="text-pink-500">Jo</span>&<span className="text-sky-500">Anos</span>{' '}
              <span aria-label="Kids">
                <span className="text-blue-500">K</span><span className="text-green-500">i</span>
                <span className="text-orange-500">d</span><span className="text-purple-500">s</span>
              </span>{' '}
              {t('admin')}
            </h1>
            <div className="hidden sm:flex gap-1">
              {tabButtons.map(btn => (
                <button key={btn.key} onClick={() => setTab(btn.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === btn.key ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
                  <span className="flex items-center gap-2"><btn.icon className="w-4 h-4" /> {btn.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>
        <div className="sm:hidden flex border-t border-neutral-100">
          {tabButtons.map(btn => (
            <button key={btn.key} onClick={() => setTab(btn.key)}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${tab === btn.key ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500'}`}>
              <btn.icon className="w-4 h-4" /> {btn.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'orders' && (
          <OrdersTab orders={orders} loading={loading} onUpdateStatus={updateStatus} onDeleteOrder={deleteOrder} formatPrice={formatPrice} t={t} lang={lang} />
        )}
        {tab === 'products' && (
          <ProductsTab products={products} loading={loading} onDelete={deleteProduct} onRefresh={fetchProducts} formatPrice={formatPrice} t={t} categories={categories} />
        )}
        {tab === 'categories' && (
          <CategoriesTab categories={categories} loading={loading} onRefresh={fetchCategories} t={t} />
        )}
        {tab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({ orders, loading, onUpdateStatus, onDeleteOrder, formatPrice, t, lang }: {
  orders: AdminOrder[];
  loading: boolean;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  formatPrice: (price: number) => string;
  t: (key: TKey) => string;
  lang: string;
}) {
  const statuses: OrderStatus[] = ['Pending', 'Shipped', 'Completed'];
  const statusLabels: Record<string, Record<string, string>> = {
    Pending: { ar: 'قيد الانتظار', en: 'Pending' },
    Shipped: { ar: 'تم الشحن', en: 'Shipped' },
    Completed: { ar: 'مكتمل', en: 'Completed' },
  };

  if (loading) return <LoadingSkeleton />;
  if (orders.length === 0) return <div className="text-center py-16"><p className="text-neutral-400">{t('noOrders')}</p></div>;

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-xl border border-neutral-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-neutral-400 mb-1">{t('order')} #{String(order.id || '').slice(0, 8).toUpperCase()}</p>
              <h3 className="text-base font-semibold text-neutral-900">{order.customer_name}</h3>
              <p className="text-sm text-neutral-500">{order.customer_phone || 'No phone'}</p>
              {order.customer_email && <p className="text-sm text-neutral-500">{order.customer_email}</p>}
              <p className="text-sm text-neutral-500">
                {[order.shipping_address, order.city].filter(Boolean).join(', ') || 'No shipping address'}
              </p>
              {order.payment_method && <p className="text-xs text-neutral-400 mt-1">{order.payment_method}</p>}
              <p className="text-xs text-neutral-400 mt-1">
                {new Date(order.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700' : order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                {statusLabels[order.status]?.[lang] || order.status}
              </span>
              <p className="text-lg font-bold text-neutral-900">{formatPrice(order.total_amount)}</p>
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-4 mb-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">{t('itemsLabel')}</p>
            <div className="space-y-1.5">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-700">{item.product_title} ({item.size}/{item.color}) x{item.quantity}</span>
                  <span className="text-neutral-900 font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button key={s} onClick={() => onUpdateStatus(order.id, s)} disabled={order.status === s}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${order.status === s ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                {t('mark')} {statusLabels[s]?.[lang] || s}
              </button>
            ))}
            <button onClick={() => onDeleteOrder(order.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> {t('deleteOrder')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab({ products, loading, onDelete, onRefresh, formatPrice, t, categories }: {
  products: Product[];
  loading: boolean;
  onDelete: (id: string) => void;
  onRefresh: () => Promise<void>;
  formatPrice: (price: number) => string;
  t: (key: TKey) => string;
  categories: Category[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  if (loading) return <LoadingSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-900">{t('products')} ({products.length})</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors">
          <Plus className="w-4 h-4" /> {t('addProduct')}
        </button>
      </div>

      {products.length === 0 && !showForm ? (
        <div className="text-center py-16"><p className="text-neutral-400">{t('noProductsYet')}</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => {
            const isOnSale = p.compare_at_price && p.compare_at_price > p.price;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                <div className="aspect-[3/2] bg-neutral-100 relative">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm">No image</div>
                  }
                  {isOnSale && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {t('sale')}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-neutral-900 text-sm">{p.title}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">{p.category_name || p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900 text-sm">{formatPrice(p.price)}</p>
                      {isOnSale && <p className="text-xs text-neutral-400 line-through">{formatPrice(p.compare_at_price!)}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setEditing(p); setShowForm(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> {t('edit')}
                    </button>
                    <button onClick={() => onDelete(p.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> {t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={onRefresh}
          t={t}
          categories={categories}
        />
      )}
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────

function ProductForm({ product, onClose, onSaved, t, categories }: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
  t: (key: TKey) => string;
  categories: Category[];
}) {
  const [form, setForm] = useState({
    title: product?.title || '',
    price: product?.price?.toString() || '',
    compare_at_price: product?.compare_at_price?.toString() || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    category: product?.category || (categories[0]?.slug || ''),
    sizes: ensureString(product?.sizes) || 'S, M, L, XL',
    colors: ensureString(product?.colors) || 'Black, White, Navy',
    featured: product?.featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleImageFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const publicUrl = await uploadImage(file, 'product-images');
      update('image_url', publicUrl);
    } catch (err) {
      alert(`Image upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) { alert('Please wait for the image to finish uploading.'); return; }

    const price = Number(form.price);
    const compareAtPrice = form.compare_at_price ? Number(form.compare_at_price) : null;

    if (!Number.isFinite(price)) { alert('Please enter a valid product price.'); return; }
    if (compareAtPrice !== null && !Number.isFinite(compareAtPrice)) { alert('Please enter a valid original price.'); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      price,
      compare_at_price: compareAtPrice,
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      category: form.category,
      sizes: ensureString(form.sizes).trim(),
      colors: ensureString(form.colors).trim(),
      featured: form.featured,
    };

    try {
      if (product) {
        const productId = String(product.id);
        if (!isUuid(productId)) { alert('Cannot update: invalid product ID. Please refresh.'); return; }
        const { error } = await supabase.from('products').update(payload).eq('id', productId);
        if (error) { alert(`Failed to update product: ${error.message}`); return; }
      } else {
        const { error } = await supabase.from('products').insert(payload).select('id').single();
        if (error) { alert(`Failed to add product: ${error.message}`); return; }
      }
      await onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isBusy = saving || uploadingImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-900">{product ? t('editProduct') : t('addProduct')}</h3>
          <button onClick={onClose} disabled={isBusy} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('title')}</label>
            <input required value={form.title} onChange={e => update('title', e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('price')} (EGP)</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => update('price', e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('originalPrice')} (EGP)</label>
              <input type="number" step="0.01" min="0" value={form.compare_at_price} onChange={e => update('compare_at_price', e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Optional" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('category')}</label>
            <select value={form.category} onChange={e => update('category', e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white">
              {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name_en} / {cat.name_ar}</option>)}
            </select>
          </div>

          <ImageUploadField
            currentUrl={form.image_url}
            onUrlChange={url => update('image_url', url)}
            uploading={uploadingImage}
            onFileSelected={handleImageFile}
            label={t('imageUrl')}
          />

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('description')}</label>
            <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('sizes')}</label>
              <input value={form.sizes} onChange={e => update('sizes', e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('colors')}</label>
              <input value={form.colors} onChange={e => update('colors', e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
            <span className="text-sm font-medium text-neutral-700">{t('featuredProduct')}</span>
          </label>

          <button type="submit" disabled={isBusy}
            className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {uploadingImage
              ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Uploading image…</>
              : saving
                ? t('saving')
                : <><Check className="w-4 h-4" /> {product ? t('updateProduct') : t('addProduct')}</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────────────────

function CategoriesTab({ categories, loading, onRefresh, t }: {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
  t: (key: TKey) => string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name_en: '', name_ar: '', slug: '', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const publicUrl = await uploadImage(file, 'category-images');
      setForm(p => ({ ...p, image_url: publicUrl }));
    } catch (err) {
      alert(`Image upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) { alert('Please wait for the image to finish uploading.'); return; }
    setSaving(true);
    const { error } = await supabase.from('categories').insert({
      name_en: form.name_en,
      name_ar: form.name_ar,
      slug: form.slug,
      image_url: form.image_url || null,
    });
    setSaving(false);
    if (error) { alert('Failed to add category.'); return; }
    setForm({ name_en: '', name_ar: '', slug: '', image_url: '' });
    setShowForm(false);
    onRefresh();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm(t('deleteCategoryConfirm'))) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { alert('Failed to delete category.'); return; }
    onRefresh();
  };

  const isBusy = saving || uploadingImage;

  if (loading) return <LoadingSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-900">{t('categories')} ({categories.length})</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors">
          <Plus className="w-4 h-4" /> {t('addCategory')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-neutral-100 p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('categoryNameEn')}</label>
              <input required value={form.name_en} onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('categoryNameAr')}</label>
              <input required value={form.name_ar} onChange={e => setForm(p => ({ ...p, name_ar: e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" dir="rtl" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('categorySlug')}</label>
              <input required value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="e.g. Dresses" />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                currentUrl={form.image_url}
                onUrlChange={url => setForm(p => ({ ...p, image_url: url }))}
                uploading={uploadingImage}
                onFileSelected={handleImageFile}
                label={t('imageUrl')}
              />
            </div>

            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" disabled={isBusy}
                className="bg-neutral-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2">
                {uploadingImage
                  ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Uploading…</>
                  : saving
                    ? t('saving')
                    : <><Plus className="w-4 h-4" /> {t('addCategory')}</>
                }
              </button>
              <button type="button" onClick={() => setShowForm(false)} disabled={isBusy}
                className="px-6 py-2.5 rounded-full text-sm font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-16"><p className="text-neutral-400">{t('noCategories')}</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-neutral-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {cat.image_url
                  ? <img src={cat.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  : <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center"><Tags className="w-5 h-5 text-neutral-300" /></div>
                }
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{cat.name_en}</p>
                  <p className="text-xs text-neutral-500" dir="rtl">{cat.name_ar}</p>
                  <p className="text-xs text-neutral-400">{cat.slug}</p>
                </div>
              </div>
              <button onClick={() => deleteCategory(cat.id)}
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const [pixelId, setPixelId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'facebook_pixel_id')
      .single()
      .then(({ data }) => {
        if (data?.value) setPixelId(data.value);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase
      .from('settings')
      .update({ value: pixelId.trim() })
      .eq('key', 'facebook_pixel_id');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-bold text-neutral-900 mb-6">Settings</h2>
      <div className="bg-white rounded-xl border border-neutral-100 p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Facebook Pixel ID
            </label>
            <input
              value={pixelId}
              onChange={e => setPixelId(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="e.g. 1234567890123456"
            />
            <p className="text-xs text-neutral-400 mt-1">
              هتلاقي الـ Pixel ID في Facebook Events Manager
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl border border-neutral-100 p-6">
          <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3" />
          <div className="h-3 bg-neutral-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-neutral-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
