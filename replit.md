# Kayan Medical - Medical Ultrasound Equipment Website

## Overview

Kayan Medical is an Arabic-first e-commerce and service platform for medical ultrasound equipment in Egypt. The application serves doctors and medical facilities by providing product catalogs, maintenance services, consultation booking, and special offers for ultrasound devices from premium brands like GE, Philips, and Samsung.

**Target Audience**: Medical professionals (doctors) specializing in obstetrics, radiology, and general practice who need ultrasound equipment for clinics and hospitals.

**Primary Language**: Arabic (Egyptian dialect) with English technical terms for device specifications and model numbers.

**Geographic Focus**: Egypt, with specific presence in Shibin El Kom and Sheikh Zayed.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing with the following pages:
- Home (landing page with hero, features, testimonials)
- Products (catalog with category filtering)
- Product Detail (`/products/:id` - individual product pages with specifications and WhatsApp CTA)
- Trade-In (device buying and exchange service - both purchasing used devices and trading old for new)
- Maintenance (service request forms)
- About (company information and team)
- Contact (contact form and location details)
- Offers (special deals and news)
- Admin Login (`/admin/login` - authentication page for admin access)
- Admin Dashboard (`/admin/dashboard` - protected admin panel for viewing submissions)

**UI Component System**: Shadcn UI components (New York style) with Radix UI primitives for:
- Forms with React Hook Form and Zod validation
- Dialog modals and sheets
- Navigation menus and tabs
- Cards and badges
- Toast notifications

**Styling Approach**: 
- Tailwind CSS with custom configuration for RTL (right-to-left) support
- Arabic typography using Cairo and Tajawal Google Fonts
- English/technical typography using Inter font
- Custom color system with HSL values for theme consistency
- Responsive design with mobile-first breakpoints

**State Management**: 
- TanStack Query (React Query) for server state and API caching
- React Hook Form for form state management
- Local component state with React hooks

**Design System**:
- RTL layout with proper Arabic text flow
- Spacing based on Tailwind's 4px unit system
- Maximum container width of 1280px (max-w-7xl)
- Consistent card-based layouts with hover effects
- Professional medical aesthetic balancing trust and modernity

**UI Features & Interactions**:
- Animated Stats Counter (StatsSection component):
  - Smooth counting animation from 0 to target values
  - Triggers via Intersection Observer when section becomes 20% visible
  - One-time animation per page load using useRef flag
  - 2-second duration with 60 animation steps for smooth visual effect
  - Proper cleanup of intervals and observers to prevent memory leaks
  - Displays: 500+ doctors/clinics, 15+ years experience, 800+ devices sold, 98% satisfaction rate
  - Professional medical icons with gradient backgrounds (Stethoscope, Award, PackageCheck, ThumbsUp)
  - Hover effects: icon scaling and number color transitions

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode

**Authentication System**:
- Passport.js with local strategy for email/password authentication
- Express session management with httpOnly cookies (24-hour expiration)
- bcryptjs for password hashing (10 rounds)
- Admin user seeded on server startup: faris@omniflowai.agency / faris123456
- Protected routes using requireAuth and requireAdmin middleware
- **Case-insensitive email authentication**: All emails normalized to lowercase
  - Auth layer: Email normalized before lookup (`email.trim().toLowerCase()`)
  - Storage layer: Email normalized in queries and user creation
  - Database: Unique index on `LOWER(email)` prevents duplicate emails with different cases
- **Production-ready session**: Trust proxy enabled for secure cookies in production environments

**API Structure**: RESTful endpoints organized by resource type:

**Authentication:**
- `/api/auth/login` - Admin login with email/password
- `/api/auth/logout` - Session logout
- `/api/auth/me` - Check authentication status

**Form Submissions:**
- `/api/contact` - Contact form submissions (POST public, GET protected)
- `/api/maintenance` - Maintenance request handling (POST public, GET protected)
- `/api/consultation` - Consultation booking (POST public, GET protected)

**Content Management (CMS):**
All content types follow consistent patterns:
- Public endpoints: GET `/api/{resource}` - Returns only active items
- Admin endpoints: GET `/api/{resource}/all` - Returns all items including inactive (requireAdmin)
- Mutations: POST `/api/{resource}`, PUT `/api/{resource}/:id`, DELETE `/api/{resource}/:id` (requireAdmin)

Implemented resources:
- `/api/products` & `/api/products/all` - Full CRUD for ultrasound devices
- `/api/testimonials` & `/api/testimonials/all` - Full CRUD for doctor testimonials
- `/api/offers` & `/api/offers/all` - Full CRUD for special offers
- `/api/hero-sections` & `/api/hero-sections/all` - Single-record edit for hero section
- `/api/features` & `/api/features/all` - Full CRUD for company features/benefits
- `/api/stats` & `/api/stats/all` - Full CRUD for statistics counters

**Cache Invalidation Strategy:**
- All mutations invalidate both admin (`/all`) and public query caches
- Uses TanStack Query's `queryClient.invalidateQueries()`
- Ensures immediate updates on both admin dashboard and public pages

**Request Handling**:
- JSON body parsing with raw body capture for webhook verification
- Request/response logging middleware for API routes
- Error handling with structured JSON responses in Arabic

**Development Setup**:
- Vite middleware integration for HMR in development
- Static file serving for production builds
- Custom logger with timestamps

### Data Layer

**ORM**: Drizzle ORM for type-safe database operations

**Database Schema** (PostgreSQL with Neon serverless):

**Users Table**:
- Admin authentication for dashboard access
- Fields: email (unique), passwordHash, name, role (admin/editor/viewer), isActive, createdAt, lastLoginAt
- Passwords hashed with bcryptjs before storage
- Admin user automatically seeded on startup

**Products Table**:
- Stores ultrasound device information with CMS capabilities
- Fields: nameAr, nameEn, category (clinic/hospital/portable), brand, model, description, specifications (array), imageUrl, priceInfo, isActive, displayOrder
- UUID primary keys generated server-side
- isActive: boolean flag to control product visibility on public pages
- displayOrder: text field for controlling sort order in admin and public views

**Contact Forms Table**:
- Captures customer inquiries
- Fields: name, email, phone, message, createdAt timestamp
- Validation enforces minimum lengths and proper email format

**Maintenance Requests Table**:
- Tracks service requests for equipment
- Fields: clientName, deviceType, issueDescription, clinicLocation, phone

**Consultation Requests Table**:
- Manages booking requests for product consultations
- Similar structure to other form submissions

**Validation**: Zod schemas created from Drizzle schemas for runtime type checking and Arabic error messages

**Storage Implementation**: 
- In-memory storage implementation (MemStorage) for development/testing
- Interface-based design (IStorage) allows swapping to database implementation
- All storage methods return Promises for async compatibility

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives (v1.x) for accessible component foundations
- Embla Carousel for product/testimonial carousels
- Lucide React for consistent iconography
- CMDK for command palette functionality

**Form Handling**:
- React Hook Form for performant form state
- Hookform Resolvers for Zod schema integration
- Zod for runtime validation with Arabic error messages

**Styling Tools**:
- Tailwind CSS v3 with PostCSS and Autoprefixer
- Class Variance Authority for component variant patterns
- clsx and tailwind-merge for conditional class handling

**Database & ORM**:
- Drizzle ORM v0.39+ for type-safe queries
- Drizzle Kit for migrations
- Neon Serverless for PostgreSQL database
- Drizzle-Zod for schema-to-validation conversion

**State & Data Fetching**:
- TanStack Query v5 for server state management
- Date-fns for date formatting and manipulation

**Session Management**:
- Connect-pg-simple for PostgreSQL session storage
- Express-session integration (schema includes user tables)

**Development Tools**:
- Replit-specific Vite plugins (cartographer, dev-banner, runtime-error-modal)
- ESBuild for server bundling in production

**Product Data Management**:
- Shared product data file at `client/src/data/products.ts`
- 6 ultrasound devices from premium brands (GE, Philips, Samsung, Mindray, Clarius)
- Each product includes: id, nameAr, nameEn, category, brand, model, description, specifications array, imageUrl, priceInfo
- Helper functions: `getProductById(id)` and `getProductsByCategory(category)`
- Product images sourced from Unsplash with local fallback
- Categories: hospital, clinic, portable

**Asset Management**:
- Logo and images stored in attached_assets directory
- Product images from Unsplash CDN with local fallback support
- Vite alias configuration for @assets imports
- Design guidelines reference premium platforms like Shopify and Medtronic

**Typography Resources**:
- Google Fonts API for Cairo, Tajawal, and Inter font families
- Preconnect optimization for font loading performance