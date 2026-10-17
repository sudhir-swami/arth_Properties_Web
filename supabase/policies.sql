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
