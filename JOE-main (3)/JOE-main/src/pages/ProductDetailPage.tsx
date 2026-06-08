import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useLang } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { splitList } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { t, formatPrice } = useLang();

  useEffect(() => {
    if (!id) return;
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setProduct(data as Product);
        setSelectedSize(splitList(data.sizes, ['M'])[0]);
        setSelectedColor(splitList(data.colors, ['Black'])[0]);
      }
      setLoading(false);
    });
  }, [id]);

  const handleAdd = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <div className="animate-pulse grid md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] bg-neutral-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-3/4" />
            <div className="h-6 bg-neutral-200 rounded w-1/3" />
            <div className="h-20 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 text-center">
        <p className="text-neutral-500">Product not found.</p>
        <Link to="/products" className="text-neutral-900 underline mt-4 inline-block">{t('backToShop')}</Link>
      </div>
    );
  }

  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> {t('backToShop')}
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 relative">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">No image</div>
          )}
          {isOnSale && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {t('sale')}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm text-neutral-500 mb-2">{product.category_name || product.category}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">{product.title}</h1>
          <div className="flex items-center gap-3 mb-6">
            <p className="text-2xl font-semibold text-neutral-900">{formatPrice(product.price)}</p>
            {isOnSale && (
              <p className="text-lg text-neutral-400 line-through">{formatPrice(product.compare_at_price!)}</p>
            )}
          </div>
          <p className="text-neutral-600 leading-relaxed mb-8">{product.description}</p>

          <div className="mb-6">
            <label className="text-sm font-semibold text-neutral-900 mb-3 block">
              {t('size')}: <span className="font-normal text-neutral-500">{selectedSize}</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {splitList(product.sizes, ['S', 'M', 'L', 'XL']).map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-lg text-sm font-medium transition-all ${
                    selectedSize === size ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}>{size}</button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="text-sm font-semibold text-neutral-900 mb-3 block">
              {t('color')}: <span className="font-normal text-neutral-500">{selectedColor}</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {splitList(product.colors, ['Black']).map(color => (
                <button key={color} onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedColor === color ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}>{color}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAdd}
              className={`flex-1 py-4 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                added ? 'bg-green-600 text-white' : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}>
              {added ? <><Check className="w-4 h-4" /> {t('addedToCart')}</> : t('addToCart')}
            </button>
            <button onClick={handleOrderNow}
              className="flex-1 py-4 rounded-full text-sm font-semibold bg-pink-500 text-white hover:bg-pink-600 transition-colors">
              {t('orderNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
