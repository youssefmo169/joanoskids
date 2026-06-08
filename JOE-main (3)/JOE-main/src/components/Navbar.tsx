import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Globe } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';

export default function Navbar() {
  const { totalItems } = useCart();
  const { isAdmin } = useAuth();
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();

  useEffect(() => {
    supabase.from('categories').select('*').order('name_en').then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, []);

  const getCategoryLabel = (cat: Category) => lang === 'ar' ? cat.name_ar : cat.name_en;

  const navCategories = [
    { label: t('all'), path: '/products' },
    ...categories.map(cat => ({
      label: getCategoryLabel(cat),
      path: `/products?category=${cat.slug}`,
    })),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900">
            <span className="text-pink-500">Jo</span>
            <span className="text-neutral-300">&</span>
            <span className="text-sky-500">Anos</span>
            <span className="text-neutral-600 text-sm font-medium">Kids</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navCategories.map(c => (
              <Link
                key={c.path}
                to={c.path}
                className={`text-sm font-medium transition-colors hover:text-neutral-900 ${
                  location.pathname + location.search === c.path ? 'text-neutral-900' : 'text-neutral-500'
                }`}
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <Link to="/cart" className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-neutral-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to={isAdmin ? '/admin/dashboard' : '/admin/login'}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <User className="w-4 h-4" />
              {isAdmin ? t('dashboard') : t('admin')}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-neutral-50 rounded-full transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white">
          <nav className="flex flex-col py-2">
            {navCategories.map(c => (
              <Link
                key={c.path}
                to={c.path}
                onClick={() => setMenuOpen(false)}
                className="px-6 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              >
                {c.label}
              </Link>
            ))}
            <Link
              to={isAdmin ? '/admin/dashboard' : '/admin/login'}
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              {isAdmin ? t('dashboard') : t('admin')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
