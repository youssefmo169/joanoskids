import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLang } from '../contexts/LanguageContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { t, formatPrice } = useLang();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <ShoppingBag className="w-16 h-16 text-neutral-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{t('emptyCart')}</h1>
        <p className="text-neutral-500 mb-8">{t('emptyCartDesc')}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 text-sm font-semibold hover:bg-neutral-800 transition-colors rounded-full"
        >
          {t('startShopping')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8">{t('yourCart')}</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-4 p-4 bg-white border border-neutral-100 rounded-xl"
            >
              <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                <div className="w-24 h-32 rounded-lg overflow-hidden bg-neutral-100">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">No image</div>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`} className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors">
                  {item.product.title}
                </Link>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {t('size')}: {item.size} &middot; {t('color')}: {item.color}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  {item.product.compare_at_price && item.product.compare_at_price > item.product.price && (
                    <p className="text-sm text-neutral-400 line-through">
                      {formatPrice(item.product.compare_at_price * item.quantity)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-neutral-50 rounded-full px-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-neutral-100 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">{t('orderSummary')}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">{t('subtotal')}</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{t('shipping')}</span>
              <span className="font-medium text-green-600">{t('depend on your government - معتمد علي محافظتك')}</span>
            </div>
            <div className="border-t border-neutral-100 pt-3 flex justify-between">
              <span className="font-semibold text-neutral-900">{t('total')}</span>
              <span className="font-bold text-neutral-900 text-base">{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-3">{t('paymentCod')}</p>
          <Link
            to="/checkout"
            className="w-full mt-6 bg-neutral-900 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            {t('proceedToCheckout')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
