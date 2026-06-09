import { useLang } from '../contexts/LanguageContext';
import { GOVERNORATES } from '../lib/shippingRates';

export default function ShippingPage() {
  const { lang } = useLang();

  const content = lang === 'ar' ? {
    title: 'معلومات الشحن',
    subtitle: 'كل ما تحتاج معرفته عن التوصيل',
    overview: 'نقدم خدمة توصيل لجميع أنحاء مصر. تختلف تكلفة الشحن حسب المحافظة، ويمكنك الاطلاع على الأسعار التفصيلية أدناه.',
    sections: [
      {
        title: 'مناطق التوصيل',
        text: 'نوفر التوصيل لجميع المحافظات داخل مصر. للطلبات داخل القاهرة والجيزة، يتم التوصيل خلال يوم عمل إلى ٣ أيام عمل. لباقي المحافظات، قد يستغرق التوصيل من ٣ إلى ٧ أيام عمل.',
      },
      {
        title: 'تكلفة الشحن',
        text: 'تختلف تكلفة الشحن حسب المحافظة. سيتم احتساب تكلفة الشحن تلقائياً عند اختيار محافظتك في صفحة الدفع. يرجى مراجعة جدول الأسعار أدناه.',
      },
      {
        title: 'طريقة الدفع',
        text: 'نقدم خدمة الدفع عند الاستلام فقط. تدفع المبلغ نقداً لمندوب التوصيل عند استلام شحنتك. لا نطلب أي دفع مسبق عبر الإنترنت.',
      },
      {
        title: 'تتبع الطلب',
        text: 'بعد تأكيد طلبك، ستتلقى رسالة تأكيد. يمكنك التواصل معنا في أي وقت للاستعلام عن حالة شحنتك.',
      },
      {
        title: 'الاستلام',
        text: 'يرجى التأكد من صحة بيانات العنوان ورقم الهاتف عند تقديم الطلب. سيقوم مندوب التوصيل بالاتصال بك قبل الوصول.',
      },
    ],
    ratesTitle: 'أسعار الشحن حسب المحافظة',
    govHeader:  'المحافظة',
    rateHeader: 'تكلفة الشحن',
    freeLabel:  'مجاني',
    currency:   'ج.م',
  } : {
    title: 'Shipping Information',
    subtitle: 'Everything you need to know about delivery',
    overview: 'We deliver to all governorates across Egypt. Shipping costs vary by location — check the rate table below, or see the cost automatically applied at checkout when you select your governorate.',
    sections: [
      {
        title: 'Delivery Areas',
        text: 'We deliver to all 27 governorates within Egypt. For orders within Cairo and Giza, delivery takes 1–3 business days. For other governorates, delivery may take 3–7 business days.',
      },
      {
        title: 'Shipping Cost',
        text: 'Shipping rates vary by governorate. The cost will be calculated automatically when you select your governorate at checkout. See the full rate table below.',
      },
      {
        title: 'Payment Method',
        text: 'We offer Cash on Delivery (COD) only. You pay the amount in cash to the delivery agent upon receiving your shipment. No online prepayment is required.',
      },
      {
        title: 'Order Tracking',
        text: 'After confirming your order, you will receive a confirmation message. You can contact us at any time to inquire about your shipment status.',
      },
      {
        title: 'Receiving Your Order',
        text: 'Please ensure your address and phone number are correct when placing your order. The delivery agent will call you before arrival.',
      },
    ],
    ratesTitle: 'Shipping Rates by Governorate',
    govHeader:  'Governorate',
    rateHeader: 'Shipping Cost',
    freeLabel:  'Free',
    currency:   'EGP',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <p className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-3">{content.subtitle}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">{content.title}</h1>
      <p className="text-lg text-neutral-600 mb-12 leading-relaxed">{content.overview}</p>

      <div className="space-y-8 mb-16">
        {content.sections.map((section, i) => (
          <div key={i} className="border-l-4 border-neutral-900 pl-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-2">{section.title}</h2>
            <p className="text-neutral-600 leading-relaxed">{section.text}</p>
          </div>
        ))}
      </div>

      {/* ── Rates table ── */}
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">{content.ratesTitle}</h2>
      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-900 text-white">
              <th className="px-6 py-3 text-start font-semibold">{content.govHeader}</th>
              <th className="px-6 py-3 text-end font-semibold">{content.rateHeader}</th>
            </tr>
          </thead>
          <tbody>
            {GOVERNORATES.map((gov, i) => (
              <tr
                key={gov.slug}
                className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
              >
                <td className="px-6 py-3 text-neutral-800">
                  {lang === 'ar' ? gov.name_ar : gov.name_en}
                </td>
                <td className="px-6 py-3 text-end font-medium">
                  {gov.rate === 0
                    ? <span className="text-green-600">{content.freeLabel}</span>
                    : <span>{gov.rate} {content.currency}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
