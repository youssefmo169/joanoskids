import { useLang } from '../contexts/LanguageContext';

export default function ReturnPolicyPage() {
  const { lang } = useLang();

  const content = lang === 'ar' ? {
    title: 'سياسة الاسترجاع',
    subtitle: 'راحتك هي أولويتنا',
    overview: 'نريد أن تكون سعيداً بكل عملية شراء. إذا لم تكن راضياً عن طلبك لأي سبب، يمكنك إرجاعه خلال ١٤ يوماً من تاريخ الاستلام.',
    sections: [
      {
        title: 'شروط الاسترجاع',
        text: 'يمكنك إرجاع المنتجات خلال ١٤ يوماً من تاريخ الاستلام. يجب أن يكون المنتج في حالته الأصلية — غير مستخدم، غير مغسول، وبطاقات السعر والتعليقات المرفقة. يجب أن يكون المنتج في علبته الأصلية.',
      },
      {
        title: 'كيفية الإرجاع',
        text: 'تواصل معنا عبر البريد الإلكتروني أو الهاتف خلال ١٤ يوماً من الاستلام مع رقم طلبك وسبب الإرجاع. سنساعدك في ترتيب استلام المنتج من عنوانك. بعد استلام وفحص المنتج، سيتم معالجة استرداد المبلغ.',
      },
      {
        title: 'المنتجات غير القابلة للإرجاع',
        text: 'المنتجات المستخدمة أو المغسولة أو المعدلة لا تقبل الإرجاع. المنتجات بدون بطاقات السعر أو التعليقات الأصلية لا تقبل الإرجاع. الملابس الداخلية ومنتجات التخفيضات النهائية لا تقبل الإرجاع.',
      },
      {
        title: 'استرداد المبلغ',
        text: 'بعد استلام المنتج المرتجع وفحصه، سيتم استرداد المبلغ خلال ٥-١٠ أيام عمل. سيتم الاسترداد بنفس طريقة الدفع الأصلية. لطلبات الدفع عند الاستلام، سيتم تحويل المبلغ إلى حسابك البنكي أو محفظتك الإلكترونية.',
      },
      {
        title: 'التبديل',
        text: 'إذا كنت تفضل تبديل المنتج بمقاس أو لون آخر، يرجى التواصل معنا وسنساعدك في ترتيب ذلك بناءً على التوفر.',
      },
    ],
  } : {
    title: 'Return Policy',
    subtitle: 'Your satisfaction is our priority',
    overview: 'We want you to be happy with every purchase. If you\'re not satisfied with your order for any reason, you can return it within 14 days of delivery.',
    sections: [
      {
        title: 'Return Conditions',
        text: 'You may return products within 14 days of delivery. The product must be in its original condition — unused, unwashed, with all tags and labels attached. The product must be in its original packaging.',
      },
      {
        title: 'How to Return',
        text: 'Contact us via email or phone within 14 days of delivery with your order number and reason for return. We will help arrange pickup of the product from your address. After receiving and inspecting the product, your refund will be processed.',
      },
      {
        title: 'Non-Returnable Items',
        text: 'Used, washed, or altered products cannot be returned. Products without original tags or labels cannot be returned. Underwear and final sale items are non-returnable.',
      },
      {
        title: 'Refunds',
        text: 'After receiving and inspecting the returned product, refunds are processed within 5-10 business days. Refunds are issued via the original payment method. For Cash on Delivery orders, the amount will be transferred to your bank account or e-wallet.',
      },
      {
        title: 'Exchanges',
        text: 'If you prefer to exchange the product for a different size or color, please contact us and we will help arrange this based on availability.',
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <p className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-3">{content.subtitle}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">{content.title}</h1>
      <p className="text-lg text-neutral-600 mb-12 leading-relaxed">{content.overview}</p>

      <div className="space-y-8">
        {content.sections.map((section, i) => (
          <div key={i} className="bg-neutral-50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-2">{section.title}</h2>
            <p className="text-neutral-600 leading-relaxed">{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
