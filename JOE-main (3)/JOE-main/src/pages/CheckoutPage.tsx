import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t, formatPrice, lang } = useLang();
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', city: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.customer_name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          total_price: totalPrice,
          status: 'Pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_title: item.product.title,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error('Order submission failed:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-24 pb-20 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{t('orderPlaced')}</h1>
        <p className="text-neutral-500 mb-8">{t('orderPlacedDesc')}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 text-sm font-semibold hover:bg-neutral-800 transition-colors rounded-full"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-24 pb-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{t('emptyCart')}</h1>
        <p className="text-neutral-500 mb-8">{t('addItemsFirst')}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 text-sm font-semibold hover:bg-neutral-800 transition-colors rounded-full"
        >
          {t('shopNow')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8">{t('checkout')}</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-100 rounded-xl p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">{t('shippingInfo')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('fullName')}</label>
                <input required type="text" value={form.customer_name} onChange={e => update('customer_name', e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                  placeholder={lang === 'ar' ? 'أحمد محمد' : 'John Doe'} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('phoneNumber')}</label>
                <input required type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                  placeholder={lang === 'ar' ? '+20 123 456 7890' : '+1 234 567 8900'} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('city')}</label>
                <input required type="text" value={form.city} onChange={e => update('city', e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                  placeholder={lang === 'ar' ? 'القاهرة' : 'New York'} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('shippingAddress')}</label>
                <input required type="text" value={form.address} onChange={e => update('address', e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                  placeholder={lang === 'ar' ? 'شارع الرئيسي، رقم ١٢٣' : '123 Main Street, Apt 4'} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-100 rounded-xl p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">{t('paymentMethod')}</h2>
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border-2 border-neutral-900">
              <Truck className="w-5 h-5 text-neutral-700" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">{t('cod')}</p>
                <p className="text-xs text-neutral-500">{t('codSubtitle')}</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-neutral-900 text-white py-4 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? t('placingOrder') : t('confirmOrder')}
          </button>
        </form>

        <div className="bg-white border border-neutral-100 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">{t('orderSummary')}</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                <div className="w-14 h-18 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-900 truncate">{item.product.title}</p>
                  <p className="text-xs text-neutral-500">{item.size} / {item.color} x{item.quantity}</p>
                </div>
                <p className="text-xs font-medium text-neutral-900">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">{t('subtotal')}</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{t('shipping')}</span>
              <span className="text-green-600">{t('free')}</span>
            </div>
            <div className="border-t border-neutral-100 pt-2 flex justify-between font-bold text-neutral-900">
              <span>{t('total')}</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
