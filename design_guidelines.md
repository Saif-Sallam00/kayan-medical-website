# Design Guidelines: Kayan Medical Website

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium e-commerce platforms (Shopify, Medtronic) and healthcare industry leaders, adapted for Arabic RTL medical equipment market. Focus on trust-building, professional credibility, and clear product presentation.

**Key Design Principles**:
- Medical professionalism with modern sophistication
- Trust through visual hierarchy and clean layouts
- Arabic-first experience with seamless RTL support
- Product-focused presentation with technical credibility

---

## Typography System

### Arabic Typography
- **Primary Font**: 'Cairo' (Google Fonts) - Modern Arabic typeface with excellent readability
- **Secondary Font**: 'Tajawal' (Google Fonts) - Clean sans-serif for body text
- **Display**: Cairo Bold (2.5rem-4rem) for headlines and hero sections
- **Headings**: Cairo SemiBold (1.5rem-2rem) for section titles
- **Body**: Tajawal Regular (1rem-1.125rem) for content paragraphs
- **Captions**: Tajawal Light (0.875rem) for metadata and supporting text

### English/Technical Typography
- **Technical Font**: 'Inter' (Google Fonts) for English product names and specifications
- **Model Numbers**: Inter Medium (0.875rem-1rem) for device models like "GE Voluson E10"
- Keep English terms inline within Arabic text, maintaining proper spacing

### RTL Considerations
- Right-to-left text flow for all Arabic content
- Proper Arabic numeral rendering
- Reversed layout grid (content flows right-to-left)
- Mirror navigation and UI elements appropriately

---

## Layout System

### Spacing Primitives
**Core Tailwind Units**: 4, 6, 8, 12, 16, 20, 24
- Small gaps: `gap-4` (1rem)
- Section padding: `py-16 md:py-24` (4rem-6rem)
- Container padding: `px-6 md:px-12` (1.5rem-3rem)
- Card spacing: `p-6` or `p-8`
- Element margins: `mb-6`, `mt-8`, `mx-4`

### Grid Structure
- **Container Max-Width**: `max-w-7xl` (1280px) for main content
- **Product Grids**: Single column mobile → 2 columns tablet → 3-4 columns desktop
- **Content Width**: `max-w-4xl` for text-heavy sections (About, Articles)
- **Form Layouts**: Single column mobile → 2 column desktop for contact forms

### RTL Grid Implementation
```
Mobile: Single column (col-span-1)
Tablet: 2 columns (md:grid-cols-2) 
Desktop: 3-4 columns (lg:grid-cols-3, xl:grid-cols-4)
All grids automatically reverse for RTL
```

---

## Core Components

### Navigation
- **Sticky header** with logo (right side for RTL), navigation links centered, CTA button left
- Main nav items: الرئيسية | المنتجات | الصيانة | من نحن | التواصل | العروض
- Mobile: Hamburger menu (left side for RTL) with slide-in drawer
- Phone number and WhatsApp icon prominently displayed in header

### Hero Section (Home Page)
- **Full-width hero**: Medical professional using ultrasound equipment (high-quality image)
- **Overlay content** (right-aligned for RTL):
  - Large headline in Cairo Bold (3.5rem)
  - Supporting text in Tajawal (1.25rem)
  - Dual CTA buttons with blurred backgrounds (primary + secondary actions)
  - Trust indicators below CTAs (certifications, device count, years experience)
- Height: 85vh on desktop, 70vh on mobile
- Background: Subtle gradient overlay on image for text readability

### Product Cards
- **Card structure**:
  - Product image (4:3 aspect ratio)
  - Device brand logo (small, top-right corner)
  - Product name (Arabic + English model)
  - 2-3 key specs as icon + text pairs
  - Pricing (if applicable) or "استفسر عن السعر"
  - CTA button: "تفاصيل المنتج" or "طلب استشارة"
- Hover: Subtle lift effect (shadow increase, slight scale)
- Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for product listings

### Testimonial Component
- **Doctor testimonial cards**:
  - Doctor photo (circular, 80px)
  - Name and specialization
  - Quote text in Tajawal Light (1.125rem)
  - Star rating (5-star icon system from Heroicons)
  - Clinic/hospital name
- Layout: Carousel on mobile, 3-column grid on desktop
- Background: Subtle card with border treatment

### Service Request Form (Maintenance Page)
- **Form structure** (2-column on desktop):
  - اسم العميل (Client name)
  - نوع الجهاز (Device type - dropdown)
  - وصف العطل (Issue description - textarea)
  - موقع العيادة (Clinic location)
  - رقم الهاتف (Phone number)
  - Submit button: "إرسال طلب الصيانة"
- Input styling: Clean borders, adequate padding (`p-3`), clear focus states
- Labels: Cairo Medium, above inputs

### Stats Section
- **4-column grid** showcasing credibility:
  - عدد الأطباء (Number of doctors served)
  - سنوات الخبرة (Years of experience)
  - أجهزة تم بيعها (Devices sold)
  - معدل الرضا (Satisfaction rate)
- Large numbers (Cairo Bold, 3rem), supporting text below
- Icons from Heroicons (medical, chart, device icons)

### Footer
- **Multi-column layout** (stack on mobile, 4 columns desktop):
  - Column 1: Company info + logo
  - Column 2: Quick links (روابط سريعة)
  - Column 3: Contact info with icons (phone, email, location)
  - Column 4: Social media links + newsletter signup
- Locations prominently displayed: شيبين الكوم - المنوفية | الشيخ زايد - القاهرة
- Bottom bar: Copyright, privacy policy, terms

---

## Page-Specific Layouts

### Products Page
- **Filter sidebar** (right side for RTL): Categories, price range, brands
- Main content: Product grid with 12-20 items per page
- **Category tabs** above grid: أجهزة العيادات | أجهزة المستشفيات | أجهزة محمولة
- Pagination at bottom

### About Page
- **Hero**: Team photo or modern clinic setup
- Vision/Mission: 2-column alternating layout (image + text blocks)
- Team section: Photo grid with name/role overlays
- Timeline: Company milestones in vertical format

### Contact Page
- **Split layout** (desktop): 
  - Right: Contact form (60% width)
  - Left: Office information, map embed (40% width)
- **Dual location cards**: Shebin El-Kom and Sheikh Zayed with Google Maps integration
- Social media icons prominently displayed

---

## Images Strategy

### Required Images
1. **Hero Image**: Medical professional operating ultrasound device on patient (high-quality, professional photography)
2. **Product Images**: High-resolution photos of all ultrasound devices (GE Voluson E10, Philips ClearVue, Samsung UGEO PT60A, etc.) on white background
3. **About Section**: Team photo, office/showroom images
4. **Testimonials**: Doctor headshots (circular crops)
5. **Service Images**: Technician performing maintenance work
6. **Office Locations**: Exterior/interior photos of both locations

### Image Treatment
- **Aspect Ratios**: 16:9 for heroes, 4:3 for products, 1:1 for testimonials
- All product images on consistent white/light background
- Use subtle shadows on product cards for depth

---

## Icon System

**Library**: Heroicons (via CDN)
- Medical cross for healthcare features
- Device/monitor for equipment categories
- Wrench for maintenance services
- Phone, email, location for contact
- Check marks for features/benefits
- Star ratings for testimonials

---

## Accessibility & RTL

- Maintain WCAG 2.1 AA standards
- Proper ARIA labels in Arabic
- Keyboard navigation respects RTL flow
- Form validation messages in Arabic
- High contrast maintained throughout
- Touch targets minimum 44x44px

---

## Additional Features

- WhatsApp floating button (bottom-left for RTL)
- Breadcrumb navigation on interior pages (right-aligned)
- "Back to top" button on long pages
- Loading states for form submissions
- Success/error message toasts (Arabic)