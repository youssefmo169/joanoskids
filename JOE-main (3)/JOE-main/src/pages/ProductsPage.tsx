import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLang } from '../contexts/LanguageContext';
import type { Product, Category } from '../types';
import { splitList } from '../types';
import ProductCard from '../components/ProductCard';

interface QuickCheckoutProduct {
  product: Product;
  open: boolean;
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickCheckout, setQuickCheckout] = useState<QuickCheckoutProduct | null>(null);
  const categoryParam = searchParams.get('category') || 'All';
  const { t, lang } = useLang();

  useEffect(() => {
    supabase.from('categories').select('*').order('name_en').then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (categoryParam !== 'All') query = query.eq('category', categoryParam);
    query.then(({ data }) => {
      setProducts((data as Product[]) || []);
      setLoading(false);
    });
  }, [categoryParam]);

  const handleCategory = (cat: string) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const getCategoryLabel = (cat: Category) => lang === 'ar' ? cat.name_ar : cat.name_en;

  const getCategoryLabelBySlug = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? getCategoryLabel(cat) : slug;
  };

  const handleOrderNow = (product: Product) => {
    setQuickCheckout({ product, open: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          {categoryParam === 'All' ? t('allProducts') : getCategoryLabelBySlug(categoryParam)}
        </h1>
        <span className="text-sm text-neutral-500">{products.length} {t('items')}</span>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <SlidersHorizontal className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        <button
          onClick={() => handleCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            categoryParam === 'All' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {t('all')}
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              categoryParam === cat.slug ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-neutral-200 rounded-lg mb-3" />
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-1" />
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} onOrderNow={handleOrderNow} />)}
        </div>
      )}

      {quickCheckout?.open && (
        <QuickCheckoutModal
          product={quickCheckout.product}
          onClose={() => setQuickCheckout(null)}
        />
      )}
    </div>
  );
}

function QuickCheckoutModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { t, lang, formatPrice } = useLang();
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', city: '' });
  const [size, setSize] = useState(splitList(product.sizes, ['M'])[0]);
  const [color, setColor] = useState(splitList(product.colors, ['Black'])[0]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        customer_name: form.customer_name, phone: form.phone, address: form.address, city: form.city,
        total_price: product.price, status: 'Pending',
      }).select().single();
      if (orderError) throw orderError;
      const { error: itemsError } = await supabase.from('order_items').insert({
        order_id: order.id, product_id: product.id, product_title: product.title,
        size, color, quantity: 1, price: product.price,
      });
      if (itemsError) throw itemsError;
      setSuccess(true);
    } catch { alert('Failed to place order.'); }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('orderPlaced')}</h3>
          <p className="text-sm text-neutral-500 mb-4">{t('orderPlacedDesc')}</p>
          <button onClick={onClose} className="bg-neutral-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800">{t('continueShopping')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-neutral-900">{t('quickCheckout')}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xl">&times;</button>
        </div>
        <div className="p-6">
          <div className="flex gap-3 mb-4 pb-4 border-b border-neutral-100">
            <div className="w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
              {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{product.title}</p>
              <div className="flex gap-1 mt-1">
                <p className="text-sm font-bold text-neutral-900">{formatPrice(product.price)}</p>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <p className="text-sm text-neutral-400 line-through">{formatPrice(product.compare_at_price)}</p>
                )}
              </div>
              <div className="flex gap-1.5 mt-2">
                <select value={size} onChange={e => setSize(e.target.value)} className="text-xs border border-neutral-200 rounded px-2 py-1 bg-white">
                  {splitList(product.sizes, ['S', 'M', 'L', 'XL']).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={color} onChange={e => setColor(e.target.value)} className="text-xs border border-neutral-200 rounded px-2 py-1 bg-white">
                  {splitList(product.colors, ['Black']).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required value={form.customer_name} onChange={e => update('customer_name', e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} />
            <input required type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" placeholder={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} />
            <input required value={form.city} onChange={e => update('city', e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" placeholder={lang === 'ar' ? 'المدينة' : 'City'} />
            <input required value={form.address} onChange={e => update('address', e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" placeholder={lang === 'ar' ? 'عنوان الشحن' : 'Shipping Address'} />
            <button type="submit" disabled={submitting}
              className="w-full bg-[#1a202c] text-white py-3 rounded-full text-sm font-semibold hover:bg-slate-800 disabled:opacity-50">
              {submitting ? t('placingOrder') : t('confirmOrder')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
