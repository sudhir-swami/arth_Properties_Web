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
-- ==============================================================================
-- Arth Properties - Row Level Security (RLS) Policies
-- ==============================================================================

-- 1. Enable RLS on all tables
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

-- 2. PROPERTIES POLICIES
drop policy if exists "Public can view published properties" on public.properties;
create policy "Public can view published properties"
  on public.properties
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admins can view all properties" on public.properties;
create policy "Admins can view all properties"
  on public.properties
  for select
  to authenticated
  using (true);

drop policy if exists "Admins can insert properties" on public.properties;
create policy "Admins can insert properties"
  on public.properties
  for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update properties" on public.properties;
create policy "Admins can update properties"
  on public.properties
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete properties" on public.properties;
create policy "Admins can delete properties"
  on public.properties
  for delete
  to authenticated
  using (true);


-- 3. PROPERTY IMAGES POLICIES
drop policy if exists "Public can view property images" on public.property_images;
create policy "Public can view property images"
  on public.property_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_images.property_id
      and (p.published = true or auth.role() = 'authenticated')
    )
  );

drop policy if exists "Admins can insert property images" on public.property_images;
create policy "Admins can insert property images"
  on public.property_images
  for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update property images" on public.property_images;
create policy "Admins can update property images"
  on public.property_images
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete property images" on public.property_images;
create policy "Admins can delete property images"
  on public.property_images
  for delete
  to authenticated
  using (true);


-- 4. CUSTOMER ENQUIRIES POLICIES
drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (
    customer_name is not null and length(trim(customer_name)) > 0
    and phone is not null and length(trim(phone)) >= 10
    and message is not null and length(trim(message)) > 0
  );

drop policy if exists "Admins can view all enquiries" on public.enquiries;
create policy "Admins can view all enquiries"
  on public.enquiries
  for select
  to authenticated
  using (true);

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete enquiries" on public.enquiries;
create policy "Admins can delete enquiries"
  on public.enquiries
  for delete
  to authenticated
  using (true);


-- 5. SITE SETTINGS POLICIES
drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
  on public.site_settings
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
  on public.site_settings
  for insert
  to authenticated
  with check (true);


-- 6. SUPABASE STORAGE BUCKET CONFIGURATION
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = true;

-- Storage Policies for 'property-images' bucket
drop policy if exists "Public Access to Property Images" on storage.objects;
create policy "Public Access to Property Images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'property-images');

drop policy if exists "Admins can upload property images" on storage.objects;
create policy "Admins can upload property images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "Admins can update property images" on storage.objects;
create policy "Admins can update property images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'property-images');

drop policy if exists "Admins can delete property images" on storage.objects;
create policy "Admins can delete property images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'property-images');
-- ==============================================================================
-- Arth Properties - Demonstration Data Seed Script
-- ALL ENTRIES IN THIS SEED SCRIPT ARE STRICTLY FICTIONAL DEMONSTRATION SAMPLES
-- Clearly marked with [DEMO] tag for testing and development preview.
-- ==============================================================================

-- 1. Insert Default Site Settings
insert into public.site_settings (
  id,
  business_name,
  marathi_name,
  phone,
  whatsapp_number,
  address,
  headline,
  description,
  about_text,
  service_locations,
  footer_text
) values (
  'general',
  'Arth Properties',
  'अर्थ प्रॉपर्टीज',
  '+91 96899 65655',
  '+919689965655',
  'Near Siddhi Driving School, Unnati Nagar, Gadital, Hadapsar, Pune, Maharashtra 411028, India.',
  'Find Your Perfect Property with Arth Properties',
  'Discover homes, rental properties, and commercial spaces in Hadapsar and across Pune. Find the right property with personalized guidance from our team.',
  'Arth Properties (अर्थ प्रॉपर्टीज) is a customer-focused real estate agency based in Hadapsar, Pune. We are dedicated to helping homebuyers, tenants, and commercial investors discover spaces that match their exact aspirations and budget. Guided by deep local market insight, transparent communication, and dedicated client service, we make real estate search simple, reliable, and hassle-free.',
  array['Hadapsar', 'Gadital', 'Magarpatta City', 'Amanora Park Town', 'Handewadi Road', 'Saswad Road', 'Fursungi', 'Mundhwa', 'Wanowrie', 'Kharadi'],
  'A customer-focused real estate agency helping customers discover suitable properties according to their requirements and budgets in Hadapsar, Pune.'
) on conflict (id) do update set
  business_name = excluded.business_name,
  marathi_name = excluded.marathi_name,
  phone = excluded.phone,
  whatsapp_number = excluded.whatsapp_number,
  address = excluded.address;


-- 2. Insert Sample Properties
-- Property 1: 3 BHK Apartment
insert into public.properties (
  id,
  title,
  slug,
  description,
  transaction_type,
  property_type,
  price,
  monthly_rent,
  location,
  address,
  bedrooms,
  bathrooms,
  area,
  area_unit,
  furnishing_status,
  parking_available,
  amenities,
  featured,
  status,
  published
) values (
  '11111111-1111-1111-1111-111111111111',
  '[DEMO] Premium 3 BHK Luxury Apartment in Hadapsar',
  'demo-premium-3-bhk-luxury-apartment-hadapsar',
  'Spectacular and spacious 3 BHK residential apartment situated in a prime gated society in Hadapsar. Offers seamless connectivity to Magarpatta IT Park, Pune-Solapur Highway, and Gadital. Features vitrified tile flooring, modular kitchen provisions, dual balconies with open scenic views, 24/7 security, and dedicated covered parking.',
  'buy',
  'apartment',
  8800000,
  0,
  'Hadapsar',
  'Near Siddhi Driving School, Unnati Nagar, Hadapsar, Pune 411028',
  3,
  3,
  1450,
  'sq.ft',
  'semi-furnished',
  true,
  array['Lift', 'Covered Parking', '24x7 Security', 'Power Backup', 'Club House', 'Gymnasium', 'Children Play Area', 'Rainwater Harvesting'],
  true,
  'available',
  true
) on conflict (slug) do nothing;

-- Property 2: 2 BHK Flat for Rent
insert into public.properties (
  id,
  title,
  slug,
  description,
  transaction_type,
  property_type,
  price,
  monthly_rent,
  location,
  address,
  bedrooms,
  bathrooms,
  area,
  area_unit,
  furnishing_status,
  parking_available,
  amenities,
  featured,
  status,
  published
) values (
  '22222222-2222-2222-2222-222222222222',
  '[DEMO] Modern 2 BHK Flat for Rent near Gadital',
  'demo-modern-2-bhk-flat-rent-gadital',
  'Well-maintained, sunlit 2 BHK apartment available for immediate rent near Gadital, Hadapsar. Conveniently placed near public transport, schools, markets, and IT hubs. Complete with kitchen cabinets, high-quality sanitary fixtures, and piped gas connection.',
  'rent',
  'apartment',
  0,
  22000,
  'Gadital',
  'Gadital, Pune-Solapur Road, Hadapsar, Pune 411028',
  2,
  2,
  1050,
  'sq.ft',
  'semi-furnished',
  true,
  array['Lift', 'Covered Parking', '24x7 Water Supply', 'Security Guard', 'Piped Gas', 'Balcony'],
  true,
  'available',
  true
) on conflict (slug) do nothing;

-- Property 3: Commercial Showroom / Shop
insert into public.properties (
  id,
  title,
  slug,
  description,
  transaction_type,
  property_type,
  price,
  monthly_rent,
  location,
  address,
  bedrooms,
  bathrooms,
  area,
  area_unit,
  furnishing_status,
  parking_available,
  amenities,
  featured,
  status,
  published
) values (
  '33333333-3333-3333-3333-333333333333',
  '[DEMO] Prime Commercial Showroom on Pune-Solapur Highway',
  'demo-prime-commercial-showroom-pune-solapur-highway',
  'High-footfall ground floor commercial retail shop / showroom facing the main Pune-Solapur Highway near Hadapsar. Outstanding frontage and display glass space, ideal for banks, retail clinics, branded apparel, electronics, or corporate offices.',
  'buy',
  'commercial_shop',
  7500000,
  0,
  'Hadapsar',
  'Main Road, Gadital Chowk, Hadapsar, Pune 411028',
  null,
  1,
  680,
  'sq.ft',
  'unfurnished',
  true,
  array['Main Road Facing', 'Ample Visitor Parking', '24x7 Security', 'Fire Fighting System', 'High Footfall Location'],
  true,
  'available',
  true
) on conflict (slug) do nothing;

-- Property 4: 4 BHK Luxury Villa
insert into public.properties (
  id,
  title,
  slug,
  description,
  transaction_type,
  property_type,
  price,
  monthly_rent,
  location,
  address,
  bedrooms,
  bathrooms,
  area,
  area_unit,
  furnishing_status,
  parking_available,
  amenities,
  featured,
  status,
  published
) values (
  '44444444-4444-4444-4444-444444444444',
  '[DEMO] Luxurious 4 BHK Independent Villa with Private Garden',
  'demo-luxurious-4-bhk-independent-villa-saswad-road',
  'Exclusive 4 BHK private bungalow / villa built in a serene gated enclave off Saswad Road, Hadapsar. Features private landscaped garden, terrace deck, Italian marble flooring, servant quarters, and solar water heating. Experience tranquility with urban accessibility.',
  'buy',
  'villa',
  21000000,
  0,
  'Saswad Road',
  'Green Valley Enclave, Off Saswad Road, Hadapsar, Pune 411028',
  4,
  4,
  2800,
  'sq.ft',
  'fully-furnished',
  true,
  array['Private Garden', 'Terrace Deck', 'Covered Car Porch', 'Solar Water Heating', 'Clubhouse Access', 'CCTV Surveillance'],
  true,
  'available',
  true
) on conflict (slug) do nothing;

-- Property 5: 1 BHK Rental near Magarpatta
insert into public.properties (
  id,
  title,
  slug,
  description,
  transaction_type,
  property_type,
  price,
  monthly_rent,
  location,
  address,
  bedrooms,
  bathrooms,
  area,
  area_unit,
  furnishing_status,
  parking_available,
  amenities,
  featured,
  status,
  published
) values (
  '55555555-5555-5555-5555-555555555555',
  '[DEMO] Cozy Furnished 1 BHK Flat for Rent near Magarpatta',
  'demo-furnished-1-bhk-flat-rent-magarpatta',
  'Ready-to-move fully-furnished 1 BHK flat located within minutes of Magarpatta City and SP Infocity. Perfect for working professionals. Includes refrigerator, washing machine, sofa set, bed with mattress, wardrobe, and high-speed Wi-Fi readiness.',
  'rent',
  'apartment',
  0,
  16500,
  'Magarpatta Road',
  'Opposite Cyber City, Magarpatta Road, Hadapsar, Pune 411028',
  1,
  1,
  620,
  'sq.ft',
  'fully-furnished',
  true,
  array['Furnished', 'Elevator', '2-Wheeler & 4-Wheeler Parking', 'Security Guard', 'Water Purifier', 'Gas Pipeline'],
  false,
  'available',
  true
) on conflict (slug) do nothing;

-- Property 6: Grade-A Commercial Office
insert into public.properties (
  id,
  title,
  slug,
  description,
  transaction_type,
  property_type,
  price,
  monthly_rent,
  location,
  address,
  bedrooms,
  bathrooms,
  area,
  area_unit,
  furnishing_status,
  parking_available,
  amenities,
  featured,
  status,
  published
) values (
  '66666666-6666-6666-6666-666666666666',
  '[DEMO] Grade-A Commercial Office Space for Rent',
  'demo-commercial-office-space-hadapsar-central',
  'Fully plug-and-play modern corporate office space in Hadapsar business district. Accommodates 25-30 workstations, conference room, manager cabins, pantry, and reception lobby. Complete with central air-conditioning and high-speed elevator access.',
  'rent',
  'office',
  0,
  55000,
  'Hadapsar',
  'Apex Business Hub, Solapur Road, Hadapsar, Pune 411028',
  null,
  2,
  1250,
  'sq.ft',
  'fully-furnished',
  true,
  array['Central AC', 'Conference Room', 'Reserved Parking', 'High Speed Elevators', '100% Power Backup', 'Cafeteria in Complex'],
  false,
  'available',
  true
) on conflict (slug) do nothing;

-- Property 7: NA Residential Plot
insert into public.properties (
  id,
  title,
  slug,
  description,
  transaction_type,
  property_type,
  price,
  monthly_rent,
  location,
  address,
  bedrooms,
  bathrooms,
  area,
  area_unit,
  furnishing_status,
  parking_available,
  amenities,
  featured,
  status,
  published
) values (
  '77777777-7777-7777-7777-777777777777',
  '[DEMO] Clear Title NA Residential Plot in Gated Community',
  'demo-na-residential-plot-handewadi-hadapsar',
  'Sanctioned clear-title Collector NA residential plot in a well-developed gated community near Handewadi / Saswad Road. Includes demarcated boundary, tar road access, water line connection, electricity feeder, and landscaped garden inside the layout.',
  'buy',
  'plot',
  4600000,
  0,
  'Handewadi',
  'Handewadi Road, Hadapsar Extension, Pune 411028',
  null,
  null,
  2100,
  'sq.ft',
  null,
  false,
  array['Clear Title NA', 'Internal Tar Roads', 'Street Lights', 'Water Pipeline', 'Gated Compound Wall', 'Immediate Demarcation'],
  false,
  'available',
  true
) on conflict (slug) do nothing;


-- 3. Insert Property Images
-- Images for Property 1
insert into public.property_images (property_id, image_url, is_cover, sort_order) values
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', true, 0),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', false, 1),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', false, 2),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80', false, 3);

-- Images for Property 2
insert into public.property_images (property_id, image_url, is_cover, sort_order) values
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', true, 0),
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', false, 1),
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', false, 2);

-- Images for Property 3
insert into public.property_images (property_id, image_url, is_cover, sort_order) values
('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', true, 0),
('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', false, 1);

-- Images for Property 4
insert into public.property_images (property_id, image_url, is_cover, sort_order) values
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', true, 0),
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', false, 1),
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', false, 2);

-- Images for Property 5
insert into public.property_images (property_id, image_url, is_cover, sort_order) values
('55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', true, 0),
('55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1502005229762-ae1b466428f2?auto=format&fit=crop&w=1200&q=80', false, 1);

-- Images for Property 6
insert into public.property_images (property_id, image_url, is_cover, sort_order) values
('66666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', true, 0),
('66666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80', false, 1);

-- Images for Property 7
insert into public.property_images (property_id, image_url, is_cover, sort_order) values
('77777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', true, 0);
