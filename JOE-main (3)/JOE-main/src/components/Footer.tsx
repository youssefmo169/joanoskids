import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';

export default function Footer() {
  const { t, lang } = useLang();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*').order('name_en').then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, []);

  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-bold tracking-tight mb-4">
              <span className="text-pink-400">Jo</span>
              <span className="text-neutral-500 mx-1">&</span>
              <span className="text-sky-400">Anos</span>
              <span className="text-neutral-300 ml-1 text-sm font-medium">Kids</span>
            </h3>
            <p className="text-sm leading-relaxed">
              {lang === 'ar'
                ? 'ملابس أطفال مريحة وأنيقة. مصنوعة بعناية، مصممة بهدف.'
                : 'Comfortable and stylish kids clothing. Crafted with care, designed with purpose.'}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{lang === 'ar' ? 'تسوق' : 'Shop'}</h4>
            <ul className="space-y-2 text-sm">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.slug}`} className="hover:text-white transition-colors">
                    {lang === 'ar' ? cat.name_ar : cat.name_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t('company')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about"    className="hover:text-white transition-colors">{t('aboutUs')}</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">{t('shippingInfo')}</Link></li>
              <li><Link to="/returns"  className="hover:text-white transition-colors">{t('returnPolicy')}</Link></li>
            </ul>
          </div>

          {/* Support — Contact Us now links to /contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2 text-sm">
              {/* ✅ Fixed: was a dead <span>, now a real Link */}
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  {lang === 'ar' ? 'الشحن' : 'Shipping'}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  {lang === 'ar' ? 'الاسترجاع' : 'Returns'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <span>
            &copy; {new Date().getFullYear()} {t('brand')}. {t('allRightsReserved')}.
          </span>

          {/* ── Developer credits ── */}
          <span>
            {lang === 'ar' ? 'تم التطوير بواسطة ' : 'Developed by '}
            <a
              href="https://www.facebook.com/omar.sayedabdelaziz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors underline underline-offset-2"
            >
              Omar Sayed
            </a>
            {lang === 'ar' ? ' ، ' : ' & '}
            <a
              href="https://www.facebook.com/youssefmostafa1698"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors underline underline-offset-2"
            >
              Youssef Mostafa
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
