-- ==============================================================================
-- Arth Properties - Database Schema
-- Location: Hadapsar, Pune, Maharashtra
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROPERTIES TABLE
create table if not exists public.properties (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  transaction_type text not null check (transaction_type in ('buy', 'rent')),
  property_type text not null check (property_type in ('apartment', 'independent_house', 'villa', 'plot', 'commercial_shop', 'office')),
  price numeric default 0,
  monthly_rent numeric default 0,
  location text not null,
  address text not null,
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  area numeric not null check (area > 0),
  area_unit text not null default 'sq.ft',
  furnishing_status text check (furnishing_status is null or furnishing_status in ('unfurnished', 'semi-furnished', 'fully-furnished')),
  parking_available boolean default false,
  amenities text[] default '{}',
  featured boolean default false,
  status text not null default 'available' check (status in ('available', 'under_offer', 'sold', 'rented')),
  published boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Indexes for lightning fast searching and filtering
create index if not exists idx_properties_slug on public.properties(slug);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_published on public.properties(published);
create index if not exists idx_properties_transaction_type on public.properties(transaction_type);
create index if not exists idx_properties_property_type on public.properties(property_type);
create index if not exists idx_properties_location on public.properties(location);
create index if not exists idx_properties_price on public.properties(price);
create index if not exists idx_properties_featured on public.properties(featured);

-- 2. PROPERTY IMAGES TABLE
create table if not exists public.property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  storage_path text,
  is_cover boolean default false,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_property_images_property_id on public.property_images(property_id);
create index if not exists idx_property_images_sort_order on public.property_images(sort_order);

-- 3. CUSTOMER ENQUIRIES TABLE
create table if not exists public.enquiries (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  email text,
  enquiry_type text not null default 'general' check (enquiry_type in ('general', 'callback', 'site_visit', 'property_enquiry')),
  property_id uuid references public.properties(id) on delete set null,
  preferred_location text,
  budget text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'follow_up', 'closed')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_enquiries_created_at on public.enquiries(created_at desc);

-- 4. SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id text primary key,
  business_name text not null default 'Arth Properties',
  marathi_name text not null default 'अर्थ प्रॉपर्टीज',
  phone text not null default '+91 96899 65655',
  whatsapp_number text not null default '+919689965655',
  address text not null default 'Near Siddhi Driving School, Unnati Nagar, Gadital, Hadapsar, Pune, Maharashtra 411028, India.',
  headline text not null default 'Find Your Perfect Property with Arth Properties',
  description text not null default 'Discover homes, rental properties, and commercial spaces in Hadapsar and across Pune. Find the right property with personalized guidance from our team.',
  about_text text not null default 'Arth Properties is a customer-focused real estate agency based in Hadapsar, Pune. We specialize in helping home buyers, investors, and tenants discover quality residential and commercial properties suited to their requirements and budgets.',
  service_locations text[] default array['Hadapsar', 'Gadital', 'Magarpatta City', 'Amanora Park Town', 'Handewadi Road', 'Saswad Road', 'Fursungi', 'Mundhwa', 'Wanowrie', 'Kharadi'],
  footer_text text not null default 'A customer-focused real estate agency helping customers discover suitable properties according to their requirements and budgets in Hadapsar, Pune.',
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. AUTO-UPDATE TIMESTAMP FUNCTION
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated_at on public.properties;
create trigger trg_properties_updated_at
  before update on public.properties
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row
  execute function public.update_updated_at_column();
