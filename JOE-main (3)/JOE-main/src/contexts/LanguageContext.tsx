import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Lang = 'ar' | 'en';

const translations = {
  ar: {
    // Navbar
    brand: 'جو وأنوس كيدز',
    all: 'الكل',
    cart: 'السلة',
    admin: 'المسؤول',
    dashboard: 'لوحة التحكم',

    // Hero
    newCollection: 'مجموعة 2026 الجديدة',
    redefineStyle: 'أزياء تُلهم\nأطفالكم',
    heroDesc: 'ملابس أطفال مريحة وأنيقة. اكتشف تشكيلتنا المصممة بعناية لأطفالك.',
    shopNow: 'تسوق الآن',

    // Categories
    shopByCategory: 'تسوق حسب الفئة',
    categories: 'الفئات',
    addCategory: 'إضافة فئة',
    categoryNameEn: 'اسم الفئة (إنجليزي)',
    categoryNameAr: 'اسم الفئة (عربي)',
    categorySlug: 'المعرّف',
    deleteCategory: 'حذف الفئة',
    deleteCategoryConfirm: 'هل أنت متأكد من حذف هذه الفئة؟',
    noCategories: 'لا توجد فئات بعد',

    // Featured
    featured: 'مميز',
    viewAll: 'عرض الكل',

    // COD Banner
    freeShipping: 'شحن مجاني',
    codTitle: 'الدفع عند الاستلام',
    codDesc: 'ادفع عند استلام طلبك. لا حاجة للدفع عبر الإنترنت — فقط اطلب وادفع عند بابك.',

    // Products page
    allProducts: 'جميع المنتجات',
    items: 'منتج',
    noProducts: 'لا توجد منتجات في هذه الفئة.',

    // Product detail
    backToShop: 'العودة للمتجر',
    size: 'المقاس',
    color: 'اللون',
    addToCart: 'أضف إلى السلة',
    addedToCart: 'تمت الإضافة',
    orderNow: 'اطلب الآن',
    sale: 'خصم',

    // Cart
    yourCart: 'سلة التسوق',
    emptyCart: 'سلتك فارغة',
    emptyCartDesc: 'يبدو أنك لم تضف شيئاً بعد.',
    startShopping: 'ابدأ التسوق',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    free: 'مجاني',
    total: 'الإجمالي',
    paymentCod: 'الدفع: عند الاستلام',
    orderSummary: 'ملخص الطلب',
    proceedToCheckout: 'المتابعة للدفع',

    // Checkout
    checkout: 'الدفع',
    quickCheckout: 'طلب سريع',
    shippingInfo: 'معلومات الشحن',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    city: 'المدينة',
    shippingAddress: 'عنوان الشحن',
    paymentMethod: 'طريقة الدفع',
    cod: 'الدفع عند الاستلام',
    codSubtitle: 'ادفع عند استلام طلبك',
    confirmOrder: 'تأكيد الطلب',
    placingOrder: 'جارٍ تقديم الطلب...',

    // Order success
    orderPlaced: 'تم تقديم الطلب!',
    orderPlacedDesc: 'تم تأكيد طلبك. ستدفع نقداً عند استلام شحنتك.',
    continueShopping: 'متابعة التسوق',
    addItemsFirst: 'أضف منتجات قبل الدفع.',

    // Admin
    adminPortal: 'بوابة المسؤول',
    signIn: 'تسجيل الدخول',
    email: 'البريد الإلكتروني / الهاتف',
    password: 'كلمة المرور',
    enterPassword: 'أدخل كلمة المرور',
    invalidCredentials: 'بيانات الدخول غير صحيحة',
    signingIn: 'جارٍ تسجيل الدخول...',

    // Admin Dashboard
    orders: 'الطلبات',
    products: 'المنتجات',
    logout: 'تسجيل الخروج',
    noOrders: 'لا توجد طلبات بعد',
    order: 'طلب',
    customerName: 'اسم العميل',
    phoneField: 'الهاتف',
    itemsLabel: 'المنتجات',
    mark: 'تحديد',
    pending: 'قيد الانتظار',
    shipped: 'تم الشحن',
    completed: 'مكتمل',
    addProduct: 'إضافة منتج',
    edit: 'تعديل',
    delete: 'حذف',
    noProductsYet: 'لا توجد منتجات بعد. أضف أول منتج!',
    editProduct: 'تعديل منتج',
    title: 'العنوان',
    price: 'سعر البيع',
    originalPrice: 'السعر الأصلي',
    category: 'الفئة',
    imageUrl: 'رابط الصورة',
    description: 'الوصف',
    sizes: 'المقاسات (مفصولة بفاصلة)',
    colors: 'الألوان (مفصولة بفاصلة)',
    featuredProduct: 'منتج مميز',
    updateProduct: 'تحديث المنتج',
    saving: 'جارٍ الحفظ...',
    deleteOrder: 'إلغاء الطلب',
    deleteOrderConfirm: 'هل أنت متأكد من إلغاء هذا الطلب؟',
    deleteProductConfirm: 'حذف هذا المنتج؟',
    backToHome: 'العودة إلى الرئيسية',

    // Static pages
    aboutUs: 'من نحن',
    returnPolicy: 'سياسة الاسترجاع',

    // Company
    company: 'الشركة',
    aboutUsShort: 'عن المتجر',
    sustainability: 'الاستدامة',
    careers: 'وظائف',

    // Support
    support: 'الدعم',
    contact: 'اتصل بنا',
    returns: 'الاسترجاع',
    allRightsReserved: 'جميع الحقوق محفوظة',

    // Currency
    currency: 'ج.م',
  },
  en: {
    brand: 'Jo & Anos Kids',
    all: 'All',
    cart: 'Cart',
    admin: 'Admin',
    dashboard: 'Dashboard',

    newCollection: 'New Collection 2026',
    redefineStyle: 'Fashion That\nInspires Your Kids',
    heroDesc: 'Comfortable and stylish kids clothing. Discover our carefully curated collection for your little ones.',
    shopNow: 'Shop Now',

    shopByCategory: 'Shop by Category',
    categories: 'Categories',
    addCategory: 'Add Category',
    categoryNameEn: 'Category Name (English)',
    categoryNameAr: 'Category Name (Arabic)',
    categorySlug: 'Slug',
    deleteCategory: 'Delete Category',
    deleteCategoryConfirm: 'Are you sure you want to delete this category?',
    noCategories: 'No categories yet',

    featured: 'Featured',
    viewAll: 'View All',

    freeShipping: 'Free Shipping',
    codTitle: 'Cash on Delivery',
    codDesc: 'Pay when you receive your order. No online payment needed — just place your order and pay at your doorstep.',

    allProducts: 'All Products',
    items: 'items',
    noProducts: 'No products found in this category.',

    backToShop: 'Back to shop',
    size: 'Size',
    color: 'Color',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart',
    orderNow: 'Order Now',
    sale: 'Sale',

    yourCart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    emptyCartDesc: 'Looks like you haven\'t added anything yet.',
    startShopping: 'Start Shopping',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    paymentCod: 'Payment: Cash on Delivery',
    orderSummary: 'Order Summary',
    proceedToCheckout: 'Proceed to Checkout',

    checkout: 'Checkout',
    quickCheckout: 'Quick Checkout',
    shippingInfo: 'Shipping Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    city: 'City',
    shippingAddress: 'Shipping Address',
    paymentMethod: 'Payment Method',
    cod: 'Cash on Delivery (COD)',
    codSubtitle: 'Pay when you receive your order',
    confirmOrder: 'Confirm Order',
    placingOrder: 'Placing Order...',

    orderPlaced: 'Order Placed!',
    orderPlacedDesc: 'Your order has been confirmed. You\'ll pay cash on delivery when your package arrives.',
    continueShopping: 'Continue Shopping',
    addItemsFirst: 'Add items before checking out.',

    adminPortal: 'Admin Portal',
    signIn: 'Sign In',
    email: 'Email / Phone',
    password: 'Password',
    enterPassword: 'Enter password',
    invalidCredentials: 'Invalid credentials',
    signingIn: 'Signing in...',

    orders: 'Orders',
    products: 'Products',
    logout: 'Logout',
    noOrders: 'No orders yet',
    order: 'Order',
    customerName: 'Customer Name',
    phoneField: 'Phone',
    itemsLabel: 'Items',
    mark: 'Mark',
    pending: 'Pending',
    shipped: 'Shipped',
    completed: 'Completed',
    addProduct: 'Add Product',
    edit: 'Edit',
    delete: 'Delete',
    noProductsYet: 'No products yet. Add your first product!',
    editProduct: 'Edit Product',
    title: 'Title',
    price: 'Sale Price',
    originalPrice: 'Original Price',
    category: 'Category',
    imageUrl: 'Image URL',
    description: 'Description',
    sizes: 'Sizes (comma-separated)',
    colors: 'Colors (comma-separated)',
    featuredProduct: 'Featured product',
    updateProduct: 'Update Product',
    saving: 'Saving...',
    deleteOrder: 'Cancel Order',
    deleteOrderConfirm: 'Are you sure you want to cancel this order?',
    deleteProductConfirm: 'Delete this product?',
    backToHome: 'Back to Home',

    aboutUs: 'About Us',
    returnPolicy: 'Return Policy',

    company: 'Company',
    aboutUsShort: 'About',
    sustainability: 'Sustainability',
    careers: 'Careers',

    support: 'Support',
    contact: 'Contact',
    returns: 'Returns',
    allRightsReserved: 'All rights reserved',

    currency: 'EGP',
  },
} as const;

export type TKey = keyof typeof translations.ar;

interface LanguageContextType {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Lang) => void;
  t: (key: TKey) => string;
  formatPrice: (price: number) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  }, []);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [dir, lang]);

  const t = useCallback((key: TKey): string => {
    return translations[lang][key] || key;
  }, [lang]);

  const formatPrice = useCallback((price: number): string => {
    const currency = lang === 'ar' ? 'ج.م' : 'EGP';
    if (lang === 'ar') {
      return `${price.toFixed(2)} ${currency}`;
    }
    return `${currency} ${price.toFixed(2)}`;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
