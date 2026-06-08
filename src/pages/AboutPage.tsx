import { useLang } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { lang } = useLang();

  const content = lang === 'ar' ? {
    title: 'من نحن',
    subtitle: 'قصتنا',
    p1: 'جو وأنوس كيدز هي علامة أزياء أطفال مصرية معاصرة تأسست بإيمان عميق بأن ملابس الأطفال يجب أن تجمع بين الراحة والأناقة. نحن نصمم لأطفالكم ليعبروا عن شخصيتهم بأسلوب مميز.',
    p2: 'بدأنا رحلتنا من القاهرة، حيث التقت الحرفية التقليدية بالتصميم العصري. كل قطعة في مجموعتنا مدروسة بعناية — من اختيار الأقمشة الفاخرة إلى آخر غرزة في التفصيل.',
    p3: 'فريقنا المكون من مصممين شغوفين وحرفيين مهرة يعمل يداً بيد لضمان أن كل منتج يحمل توقيع جو وأنوس كيدز المميز: البساطة المتقنة، الجودة التي تدوم، والتصميم الذي يتحدث عن نفسه.',
    values: 'قيمنا',
    v1: 'الجودة أولاً — نستخدم فقط أقمشة فاخرة ومواد عالية الجودة في كل منتج.',
    v2: 'الاستدامة — نلتزم بممارسات صديقة للبيئة في جميع مراحل الإنتاج.',
    v3: 'التصميم المدروس — كل تفصيلة مقصودة، كل خطاطة لها غاية.',
  } : {
    title: 'About Us',
    subtitle: 'Our Story',
    p1: 'Jo & Anos Kids is a contemporary Egyptian kids fashion brand founded on the deep belief that children\'s clothing should combine comfort and style. We design for your little ones to express their personality with distinction.',
    p2: 'Our journey began in Cairo, where traditional craftsmanship met modern design. Every piece in our collection is carefully considered — from the selection of premium fabrics to the last stitch in tailoring.',
    p3: 'Our team of passionate designers and skilled artisans work hand in hand to ensure that every product carries Jo & Anos Kids\' signature: refined simplicity, enduring quality, and design that speaks for itself.',
    values: 'Our Values',
    v1: 'Quality First — We use only premium fabrics and high-grade materials in every product.',
    v2: 'Sustainability — We are committed to eco-friendly practices across all stages of production.',
    v3: 'Intentional Design — Every detail is purposeful, every line has intent.',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <p className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-3">{content.subtitle}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-10">{content.title}</h1>

      <div className="space-y-6 text-neutral-600 leading-relaxed">
        <p className="text-lg">{content.p1}</p>
        <p>{content.p2}</p>
        <p>{content.p3}</p>
      </div>

      <div className="mt-16 border-t border-neutral-200 pt-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">{content.values}</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[content.v1, content.v2, content.v3].map((v, i) => (
            <div key={i} className="bg-neutral-50 rounded-xl p-6">
              <p className="text-sm text-neutral-700 leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
