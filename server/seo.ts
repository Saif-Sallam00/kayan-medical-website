// Server-rendered HTML for the public pages. The client is a SPA whose built
// index.html has one generic head and an empty #root, so crawlers that don't run
// JavaScript (most AI crawlers) see nothing. For each public route we fill in the
// page's own title, description, canonical, Open Graph tags and JSON-LD, and put
// a plain-HTML copy of its content inside #root (React replaces it on load).
import type { Express } from "express";
import { storage, type IStorage } from "./storage";
import { faqs } from "@shared/faq";

const SITE = "https://kayan-medical.com";

type Store = Pick<
  IStorage,
  "getAllProducts" | "getProduct" | "getActiveOffers" | "getActivePortfolioItems" | "getSiteSettings" | "getAboutPage"
>;

interface Page {
  status?: number;
  title: string;
  description: string;
  path: string; // canonical path
  image?: string;
  noindex?: boolean;
  jsonLd?: object[];
  body: string; // HTML placed inside #root
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const abs = (url: string) => (/^https?:\/\//.test(url) ? url : SITE + (url.startsWith("/") ? "" : "/") + url);
const clip = (s: string, n = 160) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const list = (items: string[]) => (items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>` : "");

const breadcrumbs = (...items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [["الرئيسية", "/"], ...items].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: SITE + path,
  })),
});

const NAV = `<nav>${[
  ["/", "الرئيسية"],
  ["/products", "أجهزة السونار"],
  ["/trade-in", "شراء واستبدال"],
  ["/maintenance", "الصيانة"],
  ["/offers", "العروض"],
  ["/portfolio", "سابقة الأعمال"],
  ["/about", "من نحن"],
  ["/contact", "تواصل معنا"],
]
  .map(([href, label]) => `<a href="${href}">${label}</a>`)
  .join(" | ")}</nav>`;

const FOOTER =
  "<footer><p>كيان ميديكال ستور: بيع وشراء واستبدال وصيانة أجهزة السونار في مصر. " +
  "فروعنا: شبين الكوم (المنوفية) والشيخ زايد (القاهرة). هاتف وواتساب: +20 10 25253012. " +
  "مواعيد العمل: السبت - الخميس، 9 ص - 6 م.</p></footer>";

const faqHtml = () =>
  `<section><h2>الأسئلة الشائعة</h2>${faqs.map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join("")}</section>`;

const productLinks = (products: Awaited<ReturnType<Store["getAllProducts"]>>) =>
  list(
    products.map(
      (p) =>
        `<a href="/products/${encodeURIComponent(p.id)}">${esc(p.nameAr)}</a> (${esc(p.brand)} ${esc(p.model)}): ${esc(clip(p.description, 200))}`,
    ),
  );

async function buildPage(rawPath: string, store: Store): Promise<Page> {
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;

  if (path === "/") {
    const products = (await store.getAllProducts()).filter((p) => p.isActive);
    return {
      title: "بيع وصيانة أجهزة السونار في مصر (GE, Philips, Samsung) | كيان ميديكال",
      description:
        "كيان ميديكال ستور: الخيار الأول في مصر لبيع وصيانة أجهزة السونار (جديد ومستعمل). نوفر أجهزة GE و Philips و Samsung مع ضمان شامل وخدمة ما بعد البيع.",
      path,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        },
      ],
      body:
        "<h1>بيع وشراء وصيانة أجهزة السونار في مصر</h1>" +
        "<p>كيان ميديكال تقدم أحدث أجهزة السونار الجديدة والمستعملة من GE، Philips، Samsung، Mindray، مع الضمان وخدمة ما بعد البيع والصيانة لجميع الماركات، وخدمة شراء واستبدال الأجهزة القديمة.</p>" +
        `<section><h2>أجهزة السونار المتاحة</h2>${productLinks(products)}</section>` +
        faqHtml(),
    };
  }

  if (path === "/products") {
    const products = (await store.getAllProducts()).filter((p) => p.isActive);
    return {
      title: "أجهزة السونار المتاحة جديد ومستعمل | كيان ميديكال",
      description:
        "تصفح أجهزة السونار المتاحة لدى كيان ميديكال: GE، Philips، Samsung، Mindray، جديد ومستعمل، أبيض وأسود ودوبلر ملون و4D، مع الضمان والصيانة.",
      path,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/products/${encodeURIComponent(p.id)}`,
            name: p.nameAr,
          })),
        },
        breadcrumbs(["أجهزة السونار", "/products"]),
      ],
      body: `<h1>أجهزة السونار المتاحة</h1>${productLinks(products)}`,
    };
  }

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const id = decodeURIComponent(productMatch[1]);
    const product = await store.getProduct(id);
    if (!product || !product.isActive) return notFound(path);
    const productPath = `/products/${encodeURIComponent(product.id)}`;
    const images = [product.imageUrl, ...(product.additionalImages ?? [])].filter((u): u is string => !!u).map(abs);
    return {
      title: `${product.nameAr} (${product.brand} ${product.model}) | كيان ميديكال`,
      description: clip(`${product.nameAr}: ${product.description}`),
      path: productPath,
      image: images[0],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.nameAr,
          alternateName: product.nameEn,
          description: product.description,
          brand: { "@type": "Brand", name: product.brand },
          model: product.model,
          url: SITE + productPath,
          ...(images.length ? { image: images } : {}),
        },
        breadcrumbs(["أجهزة السونار", "/products"], [product.nameAr, productPath]),
      ],
      body:
        `<h1>${esc(product.nameAr)}</h1>` +
        `<p>${esc(product.nameEn)}: ${esc(product.brand)} ${esc(product.model)}</p>` +
        `<p>${esc(product.description)}</p>` +
        `<h2>المواصفات</h2>${list(product.specifications.map(esc))}` +
        `<p>السعر: ${esc(product.priceInfo || "استفسر عن السعر")}${product.isSoldOut ? " (نفدت الكمية)" : ""}</p>`,
    };
  }

  if (path === "/offers") {
    const offers = await store.getActiveOffers();
    return {
      title: "عروض أجهزة السونار | كيان ميديكال",
      description: "أحدث عروض وخصومات أجهزة السونار الجديدة والمستعملة من كيان ميديكال في مصر.",
      path,
      jsonLd: [breadcrumbs(["العروض", "/offers"])],
      body:
        "<h1>العروض الحالية</h1>" +
        (offers.length
          ? list(
              offers.map(
                (o) =>
                  `<strong>${esc(o.titleAr)}</strong>: ${esc(o.description)}` +
                  (o.discount ? ` (${esc(o.discount)})` : "") +
                  (o.validUntil ? `، ساري حتى ${esc(o.validUntil)}` : ""),
              ),
            )
          : "<p>لا توجد عروض حالياً. تواصل معنا لمعرفة أحدث الأسعار.</p>"),
    };
  }

  if (path === "/portfolio") {
    const items = await store.getActivePortfolioItems();
    return {
      title: "سابقة أعمالنا وتسليمات أجهزة السونار | كيان ميديكال",
      description: "أجهزة سونار سلمتها كيان ميديكال لعيادات ومستشفيات في مختلف محافظات مصر.",
      path,
      jsonLd: [breadcrumbs(["سابقة الأعمال", "/portfolio"])],
      body:
        "<h1>تسليماتنا ونجاحات شركائنا</h1>" +
        list(
          items.map(
            (i) =>
              `<strong>${esc(i.titleAr)}</strong>` +
              (i.description ? `: ${esc(i.description)}` : "") +
              (i.clientName ? `، العميل: ${esc(i.clientName)}` : "") +
              (i.location ? `، ${esc(i.location)}` : ""),
          ),
        ),
    };
  }

  if (path === "/about") {
    const about = await store.getAboutPage();
    return {
      title: "من نحن | كيان ميديكال ستور",
      description:
        "كيان ميديكال: الشريك الموثوق في توفير أحدث أجهزة السونار في مصر منذ أكثر من 15 عاماً، ونخدم أكثر من 500 عيادة ومستشفى.",
      path,
      jsonLd: [breadcrumbs(["من نحن", "/about"])],
      body:
        "<h1>من نحن</h1>" +
        "<p>كيان ميديكال - الشريك الموثوق في توفير أحدث حلول الأجهزة الطبية في مصر.</p>" +
        (about ? `<h2>رؤيتنا</h2><p>${esc(about.visionAr)}</p><h2>مهمتنا</h2><p>${esc(about.missionAr)}</p>` : "") +
        "<h2>قصتنا</h2><p>بدأت كيان ميديكال كحلم لتوفير أحدث التقنيات الطبية للأطباء في مصر. منذ أكثر من 15 عاماً، كنا نؤمن بأن كل طبيب يستحق أن يكون لديه أفضل الأدوات لخدمة مرضاه. اليوم، نفخر بخدمة أكثر من 500 عيادة ومستشفى في جميع أنحاء مصر.</p>",
    };
  }

  if (path === "/contact") {
    const s = await store.getSiteSettings();
    return {
      title: "تواصل معنا | كيان ميديكال ستور",
      description:
        "تواصل مع كيان ميديكال للاستفسار عن أجهزة السونار أو الصيانة أو الاستبدال. فروعنا في شبين الكوم والشيخ زايد. السبت - الخميس 9 ص - 6 م.",
      path,
      jsonLd: [breadcrumbs(["تواصل معنا", "/contact"])],
      body:
        "<h1>تواصل معنا</h1><p>تواصل معنا للحصول على استشارة مجانية أو لأي استفسار عن منتجاتنا وخدماتنا.</p>" +
        list([
          `الهاتف: ${esc(s?.mainPhone || "+20 10 25253012")}`,
          `البريد الإلكتروني: ${esc(s?.email || "info@kayanmedical.com")}`,
          `فرع ${esc(s?.addressShebin || "شبين الكوم، المنوفية")}`,
          `فرع ${esc(s?.addressZayed || "الشيخ زايد، القاهرة")}`,
          "ساعات العمل: السبت - الخميس: 9 ص - 6 م، الجمعة: عطلة",
        ]),
    };
  }

  if (path === "/trade-in") {
    return {
      title: "شراء واستبدال أجهزة السونار المستعملة بأفضل سعر | كيان ميديكال",
      description:
        "بنشتري ونستبدل أجهزة السونار بأحسن سعر في مصر. بيع جهازك القديم أو استبدله بجهاز جديد وادفع الفرق فقط، مع تقييم عادل وشفاف.",
      path,
      jsonLd: [breadcrumbs(["شراء واستبدال", "/trade-in"])],
      body:
        "<h1>خدمة شراء واستبدال أجهزة السونار</h1>" +
        "<p>هل عندك جهاز سونار قديم؟ كيان ميديكال تشتريه منك بأفضل سعر في السوق المصري، أو استبدله بجهاز جديد بأحدث التقنيات العالمية مع دفع الفرق فقط.</p>" +
        "<h2>كيف تتم عملية الشراء أو الاستبدال؟</h2>" +
        "<ol><li>تواصل معنا عبر الواتساب أو الهاتف وأخبرنا بتفاصيل جهازك.</li><li>نقدم لك تقييماً مبدئياً للجهاز ونعرض عليك خيارات الشراء أو الاستبدال.</li><li>نعاين الجهاز أو تحضره لأحد فروعنا للفحص الدقيق.</li><li>نتفق على السعر النهائي وتستلم المبلغ نقداً، أو تستبدل بجهاز جديد مع دفع الفرق.</li></ol>",
    };
  }

  if (path === "/maintenance") {
    return {
      title: "صيانة أجهزة السونار لجميع الماركات | كيان ميديكال",
      description:
        "خدمات صيانة شاملة لجميع أنواع أجهزة السونار: صيانة دورية، قطع غيار أصلية، صيانة الطرازات القديمة، ودعم فني على مدار الساعة.",
      path,
      jsonLd: [breadcrumbs(["الصيانة", "/maintenance"])],
      body:
        "<h1>خدمات الصيانة والدعم الفني</h1>" +
        "<p>نوفر خدمات صيانة شاملة لجميع أنواع أجهزة السونار مع ضمان الجودة والسرعة في الأداء.</p>" +
        list([
          "صيانة دورية: صيانة منتظمة لضمان أداء مثالي لأجهزة السونار",
          "استبدال قطع الغيار: قطع غيار أصلية من الشركات المصنعة",
          "صيانة الطرازات القديمة: دعم وصيانة الأجهزة القديمة بما في ذلك Toshiba Aplio",
          "دعم فني على مدار الساعة لحل أي مشكلة فنية",
        ]),
    };
  }

  if (path === "/admin" || path.startsWith("/admin/")) {
    return { title: "لوحة التحكم | كيان ميديكال", description: "", path, noindex: true, body: "" };
  }

  return notFound(path);
}

function notFound(path: string): Page {
  return {
    status: 404,
    title: "الصفحة غير موجودة | كيان ميديكال",
    description: "",
    path,
    noindex: true,
    body: '<h1>الصفحة غير موجودة</h1><p><a href="/">العودة للرئيسية</a></p>',
  };
}

// Replaces the captured attribute value in the first match of `re`.
function setAttr(html: string, re: RegExp, value: string) {
  return html.replace(re, (_m, prefix: string) => prefix + esc(value));
}

function applyPage(template: string, page: Page): string {
  const url = SITE + page.path;
  let html = template.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(page.title)}</title>`);
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*/, url);
  html = setAttr(html, /(<link rel="alternate" hreflang="ar-eg" href=")[^"]*/, url);
  html = setAttr(html, /(<meta property="og:url" content=")[^"]*/, url);
  html = setAttr(html, /(<meta property="og:title" content=")[^"]*/, page.title);
  html = setAttr(html, /(<meta name="twitter:title" content=")[^"]*/, page.title);
  if (page.description) {
    html = setAttr(html, /(<meta name="description" content=")[^"]*/, page.description);
    html = setAttr(html, /(<meta property="og:description" content=")[^"]*/, page.description);
    html = setAttr(html, /(<meta name="twitter:description" content=")[^"]*/, page.description);
  }
  if (page.image) {
    html = setAttr(html, /(<meta property="og:image" content=")[^"]*/, page.image);
    html = setAttr(html, /(<meta name="twitter:image" content=")[^"]*/, page.image);
  }
  if (page.noindex) {
    html = setAttr(html, /(<meta name="robots" content=")[^"]*/, "noindex, follow");
  }
  if (page.jsonLd?.length) {
    const json = JSON.stringify(page.jsonLd).replace(/</g, "\\u003c");
    html = html.replace("</head>", () => `<script type="application/ld+json">${json}</script>\n</head>`);
  }
  if (page.body) {
    html = html.replace('<div id="root"></div>', () => `<div id="root">${NAV}<main>${page.body}</main>${FOOTER}</div>`);
  }
  return html;
}

export async function renderPage(template: string, path: string, store: Store = storage) {
  const page = await buildPage(path, store);
  return { status: page.status ?? 200, html: applyPage(template, page) };
}

// Serves every non-API GET with the page-specific HTML. Mounted after the API routes.
export function registerPages(app: Express, template: string) {
  app.get("*", async (req, res, next) => {
    if (/^\/(api|objects)(\/|$)/.test(req.path)) return next();
    res.set("Content-Type", "text/html; charset=utf-8");
    try {
      const { status, html } = await renderPage(template, req.path);
      // Cached at Vercel's edge for 5 minutes, so admin edits reach crawlers quickly.
      res.status(status).set("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400").send(html);
    } catch (error) {
      console.error("Error rendering page:", error);
      res.status(200).set("Cache-Control", "no-store").send(template);
    }
  });
}
