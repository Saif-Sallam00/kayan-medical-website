import { storage } from "./storage";

// Default products data from client/src/data/products.ts
const defaultProducts = [
  {
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

// Default testimonials
const defaultTestimonials = [
  {
    doctorName: "د. أحمد محمود",
    specialization: "أخصائي النساء والتوليد",
    quote: "أجهزة كيان ميديكال غيرت مستوى خدماتنا الطبية. الجودة ممتازة والدعم الفني متميز",
    rating: "5",
    clinicName: "عيادة النيل للنساء والتوليد",
    isActive: true,
    displayOrder: "3"
  },
  {
    doctorName: "د. فاطمة حسن",
    specialization: "طبيبة أشعة",
    quote: "التعامل مع كيان ميديكال كان احترافياً للغاية. الأجهزة دقيقة والصيانة سريعة",
    rating: "5",
    clinicName: "مركز الشفاء للأشعة التشخيصية",
    isActive: true,
    displayOrder: "2"
  },
  {
    doctorName: "د. محمد علي",
    specialization: "طبيب عام",
    quote: "ننصح بشدة بأجهزة كيان ميديكال. موثوقة وسعرها مناسب مع خدمة ما بعد البيع الممتازة",
    rating: "5",
    clinicName: "مستشفى السلام العام",
    isActive: true,
    displayOrder: "1"
  }
];

// Default features
const defaultFeatures = [
  {
    titleAr: "أجهزة من العلامات العالمية",
    descriptionAr: "نوفر أجهزة سونار من أفضل الشركات العالمية مثل GE و Philips و Samsung",
    icon: "Award",
    isActive: true,
    displayOrder: "4"
  },
  {
    titleAr: "صيانة دورية مجانية",
    descriptionAr: "نقدم خدمة صيانة دورية مجانية لضمان عمل الأجهزة بكفاءة عالية",
    icon: "Wrench",
    isActive: true,
    displayOrder: "3"
  },
  {
    titleAr: "ضمان شامل",
    descriptionAr: "جميع أجهزتنا تأتي مع ضمان شامل وخدمة دعم فني متواصلة",
    icon: "Shield",
    isActive: true,
    displayOrder: "2"
  },
  {
    titleAr: "تدريب مجاني",
    descriptionAr: "نوفر تدريب مجاني للأطباء والفنيين على استخدام الأجهزة بكفاءة",
    icon: "GraduationCap",
    isActive: true,
    displayOrder: "1"
  }
];

// Default stats
const defaultStats = [
  {
    labelAr: "عيادة ومستشفى",
    value: "500+",
    icon: "Stethoscope",
    isActive: true,
    displayOrder: "4"
  },
  {
    labelAr: "سنوات من الخبرة",
    value: "15+",
    icon: "Award",
    isActive: true,
    displayOrder: "3"
  },
  {
    labelAr: "جهاز مباع",
    value: "800+",
    icon: "PackageCheck",
    isActive: true,
    displayOrder: "2"
  },
  {
    labelAr: "نسبة رضا العملاء",
    value: "98%",
    icon: "ThumbsUp",
    isActive: true,
    displayOrder: "1"
  }
];

// Default hero section
const defaultHeroSection = {
  titleAr: "أجهزة سونار طبية بتقنية عالمية",
  subtitleAr: "نوفر أحدث أجهزة الموجات فوق الصوتية من العلامات التجارية الرائدة عالمياً مع خدمات صيانة وتدريب متميزة للعيادات والمستشفيات في مصر",
  backgroundImageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&q=80",
  ctaText: "استكشف منتجاتنا",
  ctaLink: "/products",
  isActive: true,
  displayOrder: "1"
};

export async function seedContent() {
  try {
    console.log("🌱 Starting content seeding...");

    // Check if products already exist
    const existingProducts = await storage.getAllProducts();
    if (existingProducts.length === 0) {
      console.log("📦 Seeding products...");
      for (const product of defaultProducts) {
        await storage.createProduct(product);
      }
      console.log("✅ Products seeded successfully");
    } else {
      console.log("⏭️  Products already exist, skipping");
    }

    // Check if testimonials already exist
    const existingTestimonials = await storage.getAllTestimonials();
    if (existingTestimonials.length === 0) {
      console.log("💬 Seeding testimonials...");
      for (const testimonial of defaultTestimonials) {
        await storage.createTestimonial(testimonial);
      }
      console.log("✅ Testimonials seeded successfully");
    } else {
      console.log("⏭️  Testimonials already exist, skipping");
    }

    // Check if features already exist
    const existingFeatures = await storage.getAllFeatures();
    if (existingFeatures.length === 0) {
      console.log("⭐ Seeding features...");
      for (const feature of defaultFeatures) {
        await storage.createFeature(feature);
      }
      console.log("✅ Features seeded successfully");
    } else {
      console.log("⏭️  Features already exist, skipping");
    }

    // Check if stats already exist
    const existingStats = await storage.getAllStats();
    if (existingStats.length === 0) {
      console.log("📊 Seeding stats...");
      for (const stat of defaultStats) {
        await storage.createStat(stat);
      }
      console.log("✅ Stats seeded successfully");
    } else {
      console.log("⏭️  Stats already exist, skipping");
    }

    // Check if hero section already exists
    const existingHeros = await storage.getAllHeroSections();
    if (existingHeros.length === 0) {
      console.log("🦸 Seeding hero section...");
      await storage.createHeroSection(defaultHeroSection);
      console.log("✅ Hero section seeded successfully");
    } else {
      console.log("⏭️  Hero section already exists, skipping");
    }

    console.log("✅ Content seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding content:", error);
  }
}
