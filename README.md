# Arth Properties (अर्थ प्रॉपर्टीज) — Premium Real Estate Web Platform

A complete, responsive, dynamic real estate web application built for **Arth Properties**, an independent, customer-focused real estate agency based in **Gadital, Hadapsar, Pune, Maharashtra, India**.

---

## 🌟 Overview & Key Capabilities

- **Customer-Focused Discovery**: Curated residential flats, rental apartments, independent houses, villas, plots, and commercial spaces across Hadapsar, Gadital, Magarpatta City, Amanora, Saswad Road, and Pune.
- **Dynamic Search & Filtering**: Multi-parameter search supporting Buy/Rent transaction modes, property categories, preferred Pune localities, BHK configurations, price sorting, and budget constraints.
- **Instant WhatsApp Integration**: Direct Click-to-Chat buttons with contextual prefilled messages, including property title, locality, and canonical URL.
- **Customer Enquiry Management**: Forms for site visit bookings, callback requests, and property queries with anti-spam validation and Supabase PostgreSQL persistence.
- **Secure Administrator Portal**: Role-based access via Supabase Auth for listing creation, multi-image uploads to Supabase Storage, cover image assignment, price revisions, instant publish/unpublish toggles, and enquiry tracking.
- **Demonstration / Preview Mode**: Out-of-the-box demonstration data support so the application functions seamlessly immediately upon launching, with transparent status indicators until live Supabase credentials are configured.

---

## 🏗️ Technology Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite 5](https://vitejs.dev/) with optimized Rollup code-splitting
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a bespoke Indian luxury architectural palette (Deep Navy Blue `#0a192f`, Warm Gold `#c59b27`, Crisp White, and Charcoal Slate)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Form State & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL database with strict Row Level Security policies)
- **Authentication**: Supabase Auth (Email + Password)
- **Storage**: Supabase Storage (`property-images` public bucket)

---

## 📁 Project Structure

```
arth_properties/
├── public/
│   ├── favicon.svg             # Architectural house icon
│   ├── robots.txt              # Search crawler directives
│   └── sitemap.xml             # Search engine sitemap
├── src/
│   ├── components/
│   │   ├── common/             # Header, Footer, Logo, FloatingWhatsApp, DemoNotice, EnquiryModal
│   │   ├── home/               # Hero, SearchFilterBar, FeaturedProperties, Categories, WhyChooseUs, HowItWorks, AboutIntro, ContactCTA
│   │   ├── property/           # PropertyCard, ImageGallery, Filters
│   │   └── admin/              # PropertyForm, ImageUploader, DeleteConfirmModal
│   ├── hooks/
│   │   └── useAuth.tsx         # Supabase Auth context and session management
│   ├── layouts/
│   │   ├── MainLayout.tsx      # Public layout with Header, Footer, and Floating WhatsApp
│   │   └── AdminLayout.tsx     # Admin layout with sidebar navigation and auth guards
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client & environment configuration detector
│   │   └── mockData.ts         # Fictional DEMO listings for testing & preview mode
│   ├── pages/
│   │   ├── HomePage.tsx        # Homepage (/)
│   │   ├── PropertiesPage.tsx  # Property listing with live filters (/properties)
│   │   ├── PropertyDetailPage.tsx # Property details (/properties/:slug)
│   │   ├── AboutPage.tsx       # About agency (/about)
│   │   ├── ContactPage.tsx     # Contact & Google Maps (/contact)
│   │   ├── NotFoundPage.tsx    # 404 handler
│   │   └── admin/
│   │       ├── AdminLoginPage.tsx         # Admin login (/admin/login)
│   │       ├── AdminDashboardPage.tsx     # Dashboard metrics (/admin)
│   │       ├── AdminPropertiesPage.tsx    # Manage properties (/admin/properties)
│   │       ├── AdminPropertyCreatePage.tsx# New listing form (/admin/properties/new)
│   │       ├── AdminPropertyEditPage.tsx  # Edit listing form (/admin/properties/:id/edit)
│   │       ├── AdminEnquiriesPage.tsx     # Customer leads table (/admin/enquiries)
│   │       └── AdminSettingsPage.tsx      # Agency settings (/admin/settings)
│   ├── services/
│   │   ├── propertyService.ts  # Properties CRUD & Supabase Storage integration
│   │   ├── enquiryService.ts   # Lead submission & enquiry management
│   │   └── settingsService.ts  # Site information persistence
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for domain entities
│   ├── utils/
│   │   ├── formatters.ts       # Indian currency (Lakhs/Crores), WhatsApp links, Area formatters
│   │   └── validation.ts       # Zod schemas for forms
│   ├── App.tsx                 # Route configuration
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind directives & typography
├── supabase/
│   ├── schema.sql              # Database schema (tables, constraints, triggers)
│   ├── policies.sql            # Row Level Security (RLS) & Storage policies
│   └── seed.sql                # 7 sample Pune/Hadapsar demonstration records
├── .env.example                # Example environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Prerequisites & Installation

### Required Software

- **Node.js**: `v18.0.0` or higher (tested on `v24.20.0`)
- **npm**: `v9.0.0` or higher (tested on `v11.19.0`)

### Step 1: Install Dependencies

In the root project folder, run:

```bash
npm install
```

---

## 🔑 Environment Variables Configuration

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

```env
# Supabase Project URL & Anon Public Key (from Supabase Project Settings -> API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Storage Bucket Name (Defaults to "property-images")
VITE_SUPABASE_STORAGE_BUCKET=property-images
```

> **Note on Preview Mode:** If you start the app without setting `VITE_SUPABASE_URL`, the application automatically activates **Preview Mode**. You will see a clear top banner indicating preview status, and all pages will display the 7 demonstration properties from `supabase/seed.sql`. Admin routes can be accessed with any email and password `admin123`.

---

## 🗄️ Supabase Setup Guide

Follow these steps in your [Supabase Dashboard](https://app.supabase.com):

### 1. Create a Supabase Project
- Name your project (e.g. `arth-properties`).
- Choose a region close to your target audience (e.g., `ap-south-1` Mumbai).

### 2. Execute SQL Schema
Navigate to the **SQL Editor** in your Supabase dashboard:
1. Open [`supabase/schema.sql`](supabase/schema.sql) from this project.
2. Paste the SQL into the editor and click **Run**. This creates:
   - `public.properties`
   - `public.property_images`
   - `public.enquiries`
   - `public.site_settings`
   - Automated timestamp triggers and high-performance search indexes.

### 3. Apply Row Level Security (RLS) Policies
1. Open [`supabase/policies.sql`](supabase/policies.sql).
2. Paste and run the SQL script. This enforces:
   - **Public**: Can view published properties and site settings; can insert valid customer enquiries.
   - **Admins (Authenticated)**: Can view, insert, update, and delete properties, upload images, manage enquiries, and update business settings.
   - **Unauthenticated Users**: Blocked from modifying property data or reading other users' customer enquiries.

### 4. Create the Storage Bucket
1. Navigate to **Storage** -> **New Bucket**.
2. Name the bucket `property-images`.
3. Toggle **Public bucket** to `ON` so property photos can be loaded by website visitors.
4. *(Alternatively, the SQL in `supabase/policies.sql` creates this bucket and configures storage policies automatically).*

### 5. Seed Demonstration Listings (Optional)
1. Open [`supabase/seed.sql`](supabase/seed.sql).
2. Paste and run the script to seed 7 realistic Pune/Hadapsar demonstration records clearly marked with `[DEMO]` tags.

### 6. Create the Administrator User
1. Go to **Authentication** -> **Users** -> **Add User** -> **Create user**.
2. Enter the administrator's email and a secure password.
3. Toggle **Auto Confirm User** to `ON`.
4. Use these credentials to sign in at `/admin/login`.

---

## 💻 Local Development

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at:
`http://localhost:5173`

### Primary Routes:

- **Public Website**:
  - `http://localhost:5173/` — Homepage with Hero, Search, Featured Listings, Categories, Why Choose Us, and About.
  - `http://localhost:5173/properties` — Property Catalog with real-time filters (Buy/Rent, Category, Locality, BHK, Price).
  - `http://localhost:5173/properties/:slug` — Property Details with full gallery, specs, amenities, similar listings, and WhatsApp enquiry.
  - `http://localhost:5173/about` — Agency profile and Hadapsar context.
  - `http://localhost:5173/contact` — Office address, Google Maps directions, click-to-call, and contact form.
- **Admin Portal**:
  - `http://localhost:5173/admin/login` — Administrator Sign-in.
  - `http://localhost:5173/admin` — Admin Overview metrics and recent enquiries.
  - `http://localhost:5173/admin/properties` — Property Management (publish/unpublish, feature, delete).
  - `http://localhost:5173/admin/properties/new` — Add new property with image uploads.
  - `http://localhost:5173/admin/properties/:id/edit` — Edit existing listing and gallery.
  - `http://localhost:5173/admin/enquiries` — Manage customer leads and update status (`new`, `contacted`, `follow_up`, `closed`).
  - `http://localhost:5173/admin/settings` — Update agency address, phone, and homepage copy.

---

## 🚀 Building for Production & Deployment

To verify TypeScript types and generate production-ready static assets:

```bash
npm run build
```

This outputs optimized assets to the `dist/` directory.

To test the production build locally:

```bash
npm run preview
```

### Deploying to Production (Vercel, Netlify, Cloudflare Pages, etc.)

1. Connect your repository to your hosting provider.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables in the host dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_STORAGE_BUCKET` (optional, defaults to `property-images`)
5. Configure SPA redirect rewrites (e.g. `/* -> /index.html` with status 200).

---

## 🏢 Business Identity Reference

- **Business Name**: Arth Properties (अर्थ प्रॉपर्टीज)
- **Business Type**: Real Estate Agency
- **Address**: Near Siddhi Driving School, Unnati Nagar, Gadital, Hadapsar, Pune, Maharashtra 411028, India.
- **Phone / WhatsApp**: +91 96899 65655
- **Brand Palette**: Deep Navy Blue (`#0a192f`), Warm Gold (`#c59b27`), Light Slate (`#f8fafc`), Crisp White (`#ffffff`).
