import type { Product } from "@shared/schema";

export const products: Product[] = [
  {
    id: "1",
    nameAr: "جهاز سونار GE Voluson E10",
    nameEn: "GE Voluson E10",
    category: "hospital",
    brand: "GE Healthcare",
    model: "Voluson E10",
    description: "جهاز سونار متقدم مع تكنولوجيا 4D Imaging لتقديم أعلى جودة صور للحمل وتقييم الجنين",
    specifications: [
      "تقنية 4D HD Live الحصرية",
      "معالج صور فائق السرعة",
      "نظام تصوير ثلاثي ورباعي الأبعاد"
    ],
    imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80",
    priceInfo: "استفسر عن السعر"
  },
  {
    id: "2",
    nameAr: "جهاز سونار Philips ClearVue",
    nameEn: "Philips ClearVue 650",
    category: "clinic",
    brand: "Philips",
    model: "ClearVue 650",
    description: "جهاز سونار دقيق ومتعدد الاستخدامات للاستخدامات الطبية المتقدمة في العيادات",
    specifications: [
      "شاشة LED عالية الوضوح 19 بوصة",
      "بطارية قابلة للشحن لسهولة التنقل",
      "واجهة مستخدم بسيطة وسهلة"
    ],
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
    priceInfo: "استفسر عن السعر"
  },
  {
    id: "3",
    nameAr: "جهاز سونار Samsung UGEO PT60A",
    nameEn: "Samsung UGEO PT60A",
    category: "portable",
    brand: "Samsung",
    model: "UGEO PT60A",
    description: "جهاز سونار محمول خفيف الوزن مع تقنيات تصوير متقدمة للاستخدام في أي مكان",
    specifications: [
      "وزن خفيف (5.9 كجم فقط)",
      "بطارية تدوم 4 ساعات متواصلة",
      "شاشة لمس 15.6 بوصة"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80",
    priceInfo: "عرض خاص"
  },
  {
    id: "4",
    nameAr: "جهاز سونار Mindray DC-70",
    nameEn: "Mindray DC-70",
    category: "hospital",
    brand: "Mindray",
    model: "DC-70",
    description: "نظام سونار متطور للتطبيقات السريرية الشاملة مع أداء تصوير استثنائي",
    specifications: [
      "تقنية Zone Sonography",
      "معالجة صور فائقة الدقة",
      "شاشة LED عالية الدقة 21.5 بوصة"
    ],
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80",
    priceInfo: "استفسر عن السعر"
  },
  {
    id: "5",
    nameAr: "جهاز سونار GE Logiq P9",
    nameEn: "GE Logiq P9",
    category: "clinic",
    brand: "GE Healthcare",
    model: "Logiq P9",
    description: "جهاز سونار عالي الأداء مصمم للحصول على صور واضحة في جميع التطبيقات",
    specifications: [
      "تقنية XDclear للحد من الضوضاء",
      "مجسات متعددة التطبيقات",
      "نظام تصوير دوبلر ملون متقدم"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    priceInfo: "استفسر عن السعر"
  },
  {
    id: "6",
    nameAr: "جهاز سونار محمول Clarius",
    nameEn: "Clarius Wireless Scanner",
    category: "portable",
    brand: "Clarius",
    model: "Wireless Scanner",
    description: "جهاز سونار لاسلكي فائق الحداثة يعمل مع الهواتف الذكية والأجهزة اللوحية",
    specifications: [
      "اتصال لاسلكي عبر Wi-Fi",
      "يعمل مع أجهزة iOS و Android",
      "صغير الحجم وسهل الحمل"
    ],
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    priceInfo: "عرض خاص"
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter(p => p.category === category);
}
