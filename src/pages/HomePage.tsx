import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLang } from '../contexts/LanguageContext';
import type { Product, Category } from '../types';
import { splitList } from '../types';
import ProductCard from '../components/ProductCard';

const heroImage = 'https://images.pexels.com/photos/8474941/pexels-photo-8474941.jpeg?auto=compress&cs=tinysrgb&w=1920';

const defaultCategoryImages: Record<string, string> = {
  'Dresses': 'https://images.pexels.com/photos/3522363/pexels-photo-3522363.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Sets': 'https://images.pexels.com/photos/8474941/pexels-photo-8474941.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Pajamas': 'https://images.pexels.com/photos/6192554/pexels-photo-6192554.jpeg?auto=compress&cs=tinysrgb&w=800',
};

interface QuickCheckoutProduct {
  product: Product;
  open: boolean;
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quickCheckout, setQuickCheckout] = useState<QuickCheckoutProduct | null>(null);
  const { t, lang } = useLang();

  useEffect(() => {
    supabase.from('categories').select('*').order('name_en').then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(8)
      .then(({ data }) => {
        if (data && data.length > 0) setFeatured(data as Product[]);
        else {
          supabase.from('products').select('*').limit(8).then(({ data: fallback }) => {
            if (fallback) setFeatured(fallback as Product[]);
          });
        }
      });
  }, []);

  const handleOrderNow = (product: Product) => {
    setQuickCheckout({ product, open: true });
  };

  return (
    <div>
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 sm:p-10 border border-white/50">
                <p className="text-slate-700 text-sm font-medium tracking-widest uppercase mb-4">{t('newCollection')}</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a202c] leading-[1.1] mb-4 whitespace-pre-line">
                  {t('redefineStyle')}
                </h1>
                <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed">
                  {t('heroDesc')}
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-[#1a202c] text-white px-8 py-3.5 text-sm font-semibold hover:bg-slate-800 transition-colors rounded-full"
                >
                  {t('shopNow')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-10">{t('shopByCategory')}</h2>
          <div className={`grid grid-cols-2 ${categories.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4`}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-xl">
                <img
                  src={cat.image_url || defaultCategoryImages[cat.slug] || 'https://images.pexels.com/photos/8474941/pexels-photo-8474941.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={lang === 'ar' ? cat.name_ar : cat.name_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                  {lang === 'ar' ? cat.name_ar : cat.name_en}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">{t('featured')}</h2>
            <Link to="/products" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1">
              {t('viewAll')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} onOrderNow={handleOrderNow} />)}
          </div>
        </section>
      )}

      <section className="bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-sm tracking-widest uppercase text-neutral-400 mb-3">{t('freeShipping')}</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('codTitle')}</h2>
          <p className="text-neutral-400 max-w-md mx-auto">
            {t('codDesc')}
          </p>
        </div>
      </section>

      {quickCheckout?.open && (
        <QuickCheckoutModal
          product={quickCheckout.product}
          onClose={() => setQuickCheckout(null)}
        />
      )}
    </div>
  );
}

function QuickCheckoutModal({ product, onClose }: {
  product: Product;
  onClose: () => void;
}) {
  const { t, lang, formatPrice } = useLang();
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', city: '' });
  const [size] = useState(splitList(product.sizes, ['M'])[0]);
  const [color] = useState(splitList(product.colors, ['Black'])[0]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        customer_name: form.customer_name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        total_price: product.price,
        status: 'Pending',
      }).select().single();
      if (orderError) throw orderError;
      const { error: itemsError } = await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: product.id,
        product_title: product.title,
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
              <p className="text-sm text-neutral-500">{size} / {color}</p>
              <p className="text-sm font-bold text-neutral-900 mt-1">{formatPrice(product.price)}</p>
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
