import { Phone, MessageCircle, Clock, MapPin } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

const PHONE = '01093431529';
const WHATSAPP_URL = `https://wa.me/2${PHONE}`;
const TEL_URL      = `tel:+20${PHONE}`;

export default function ContactPage() {
  const { lang } = useLang();

  const content = lang === 'ar' ? {
    eyebrow:  'تواصل معنا',
    title:    'نحن هنا لمساعدتك',
    subtitle: 'لديك سؤال عن طلبك أو تحتاج مساعدة؟ يسعدنا التحدث معك.',
    callBtn:  'اتصل بنا',
    waBtn:    'واتساب',
    hours:    'ساعات العمل',
    hoursVal: 'السبت – الخميس: ٩ ص – ١٠ م',
    location: 'نخدم جميع أنحاء مصر',
    note:     'للاستفسار عن حالة الطلب يرجى تجهيز رقم الطلب عند الاتصال.',
  } : {
    eyebrow:  'Get in Touch',
    title:    "We're Here to Help",
    subtitle: 'Have a question about your order or need assistance? We\'d love to hear from you.',
    callBtn:  'Call Us',
    waBtn:    'WhatsApp',
    hours:    'Working Hours',
    hoursVal: 'Sat – Thu: 9 AM – 10 PM',
    location: 'Serving all of Egypt',
    note:     'Please have your order number ready when you call.',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      {/* Header */}
      <p className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-3">
        {content.eyebrow}
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">{content.title}</h1>
      <p className="text-lg text-neutral-500 mb-12 leading-relaxed">{content.subtitle}</p>

      {/* ── Phone card ── */}
      <div className="bg-neutral-900 text-white rounded-2xl p-8 mb-6 text-center">
        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-6 h-6" />
        </div>
        <p className="text-neutral-400 text-sm mb-2">
          {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
        </p>
        <p
          className="text-3xl sm:text-4xl font-bold tracking-wider mb-6"
          dir="ltr"
        >
          {PHONE}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={TEL_URL}
            className="flex items-center justify-center gap-2 bg-white text-neutral-900 px-8 py-3 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {content.callBtn}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {content.waBtn}
          </a>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="border border-neutral-200 rounded-xl p-5 flex gap-4">
          <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-neutral-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 mb-1">{content.hours}</p>
            <p className="text-sm text-neutral-500">{content.hoursVal}</p>
          </div>
        </div>
        <div className="border border-neutral-200 rounded-xl p-5 flex gap-4">
          <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-neutral-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 mb-1">
              {lang === 'ar' ? 'التغطية' : 'Coverage'}
            </p>
            <p className="text-sm text-neutral-500">{content.location}</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-sm text-neutral-400 text-center">{content.note}</p>
    </div>
  );
}
