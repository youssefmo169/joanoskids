import { useLang } from '../contexts/LanguageContext';

export default function ShippingPage() {
  const { lang } = useLang();

  const content = lang === 'ar' ? {
    title: 'معلومات الشحن',
    subtitle: 'كل ما تحتاج معرفته عن التوصيل',
    overview: 'نقدم خدمة شحن مجانية لجميع الطلبات داخل مصر. نحرص على وصول طلبك بأمان وفي أسرع وقت ممكن.',
    sections: [
      {
        title: 'مناطق التوصيل',
        text: 'نوفر التوصيل لجميع المحافظات داخل مصر. للطلبات داخل القاهرة والجيزة، يتم التوصيل خلال يوم عمل إلى ٣ أيام عمل. لباقي المحافظات، قد يستغرق التوصيل من ٣ إلى ٧ أيام عمل.',
      },
      {
        title: 'تكلفة الشحن',
        text: 'الشحن مجاني لجميع الطلبات بدون حد أدنى. لا توجد رسوم إضافية على التوصيل.',
      },
      {
        title: 'طريقة الدفع',
        text: 'نقدم خدمة الدفع عند الاستلام فقط. تدفع المبلغ نقداً لمندوب التوصيل عند استلام شحنتك. لا نطلب أي دفع مسبق عبر الإنترنت.',
      },
      {
        title: 'تتبع الطلب',
        text: 'بعد تأكيد طلبك، ستتلقى رسالة تأكيد. يمكنك التواصل معنا في أي وقت للاستعلام عن حالة شحنتك عبر البريد الإلكتروني أو الهاتف.',
      },
      {
        title: 'الاستلام',
        text: 'يرجى التأكد من صحة بيانات العنوان ورقم الهاتف عند تقديم الطلب. سيقوم مندوب التوصيل بالاتصال بك قبل الوصول. يرجى الاستلام شخصياً أو تفويض شخص موثوق.',
      },
    ],
  } : {
    title: 'Shipping Information',
    subtitle: 'Everything you need to know about delivery',
    overview: 'We offer free shipping on all orders within Egypt. We ensure your order arrives safely and as quickly as possible.',
    sections: [
      {
        title: 'Delivery Areas',
        text: 'We deliver to all governorates within Egypt. For orders within Cairo and Giza, delivery takes 1-3 business days. For other governorates, delivery may take 3-7 business days.',
      },
      {
        title: 'Shipping Cost',
        text: 'Shipping is free on all orders with no minimum required. There are no additional delivery charges.',
      },
      {
        title: 'Payment Method',
        text: 'We offer Cash on Delivery (COD) only. You pay the amount in cash to the delivery agent upon receiving your shipment. No online prepayment is required.',
      },
      {
        title: 'Order Tracking',
        text: 'After confirming your order, you will receive a confirmation message. You can contact us at any time to inquire about your shipment status via email or phone.',
      },
      {
        title: 'Receiving Your Order',
        text: 'Please ensure your address and phone number are correct when placing your order. The delivery agent will call you before arrival. Please receive the order personally or authorize a trusted person.',
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
          <div key={i} className="border-l-4 border-neutral-900 pl-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-2">{section.title}</h2>
            <p className="text-neutral-600 leading-relaxed">{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
