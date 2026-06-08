import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import type { Product } from '../types';
import { splitList } from '../types';

export default function ProductCard({ product, onOrderNow }: { product: Product; onOrderNow?: (product: Product) => void }) {
  const { formatPrice, t } = useLang();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, splitList(product.sizes, ['M'])[0], splitList(product.colors, ['Black'])[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOrderNow) onOrderNow(product);
  };

  return (
    <div className="group block relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 mb-3 relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              <span className="text-sm">No image</span>
            </div>
          )}
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t('sale')}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm font-semibold text-neutral-900">{formatPrice(product.price)}</p>
          {isOnSale && (
            <p className="text-sm text-neutral-400 line-through">{formatPrice(product.compare_at_price!)}</p>
          )}
        </div>
      </Link>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
            added ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {added ? t('addedToCart') : t('addToCart')}
        </button>
        {onOrderNow && (
          <button
            onClick={handleOrderNow}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-pink-500 text-white hover:bg-pink-600 transition-colors"
          >
            {t('orderNow')}
          </button>
        )}
      </div>
    </div>
  );
}
