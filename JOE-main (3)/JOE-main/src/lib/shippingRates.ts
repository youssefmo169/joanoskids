export interface Governorate {
  slug: string;
  name_ar: string;
  name_en: string;
  rate: number;
}

export const GOVERNORATES: Governorate[] = [
  { slug: 'cairo',          name_ar: 'القاهرة',          name_en: 'Cairo',           rate: 70 },
  { slug: 'giza',           name_ar: 'الجيزة',           name_en: 'Giza',            rate: 70 },
  { slug: 'alexandria',     name_ar: 'الإسكندرية',       name_en: 'Alexandria',      rate: 80 },
  { slug: 'qalyubia',       name_ar: 'القليوبية',        name_en: 'Qalyubia',        rate: 80 },
  { slug: 'sharqia',        name_ar: 'الشرقية',          name_en: 'Sharqia',         rate: 80 },
  { slug: 'dakahlia',       name_ar: 'الدقهلية',         name_en: 'Dakahlia',        rate: 80 },
  { slug: 'gharbia',        name_ar: 'الغربية',          name_en: 'Gharbia',         rate: 80 },
  { slug: 'monufia',        name_ar: 'المنوفية',         name_en: 'Monufia',         rate: 80 },
  { slug: 'kafr-el-sheikh', name_ar: 'كفر الشيخ',        name_en: 'Kafr El Sheikh',  rate: 80 },
  { slug: 'beheira',        name_ar: 'البحيرة',          name_en: 'Beheira',         rate: 80 },
  { slug: 'damietta',       name_ar: 'دمياط',            name_en: 'Damietta',        rate: 80 },
  { slug: 'port-said',      name_ar: 'بورسعيد',          name_en: 'Port Said',       rate: 80 },
  { slug: 'ismailia',       name_ar: 'الإسماعيلية',      name_en: 'Ismailia',        rate: 80 },
  { slug: 'suez',           name_ar: 'السويس',           name_en: 'Suez',            rate: 80 },
  { slug: 'north-sinai',    name_ar: 'شمال سيناء',       name_en: 'North Sinai',     rate: 80 },
  { slug: 'south-sinai',    name_ar: 'جنوب سيناء',       name_en: 'South Sinai',     rate: 80 },
  { slug: 'fayoum',         name_ar: 'الفيوم',           name_en: 'Fayoum',          rate: 80 },
  { slug: 'beni-suef',      name_ar: 'بني سويف',         name_en: 'Beni Suef',       rate: 80 },
  { slug: 'minya',          name_ar: 'المنيا',           name_en: 'Minya',           rate: 80 },
  { slug: 'asyut',          name_ar: 'أسيوط',            name_en: 'Asyut',           rate: 80 },
  { slug: 'sohag',          name_ar: 'سوهاج',            name_en: 'Sohag',           rate: 80 },
  { slug: 'qena',           name_ar: 'قنا',              name_en: 'Qena',            rate: 80 },
  { slug: 'luxor',          name_ar: 'الأقصر',           name_en: 'Luxor',           rate: 80 },
  { slug: 'aswan',          name_ar: 'أسوان',            name_en: 'Aswan',           rate: 80 },
  { slug: 'red-sea',        name_ar: 'البحر الأحمر',     name_en: 'Red Sea',         rate: 80 },
  { slug: 'new-valley',     name_ar: 'الوادي الجديد',    name_en: 'New Valley',      rate: 80 },
  { slug: 'matruh',         name_ar: 'مطروح',            name_en: 'Matruh',          rate: 80 },
];

export function getShippingRate(slug: string): number | null {
  const gov = GOVERNORATES.find(g => g.slug === slug);
  return gov ? gov.rate : null;
}
