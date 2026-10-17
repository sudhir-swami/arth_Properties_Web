import { supabase, isSupabaseConfigured, STORAGE_BUCKET } from '@/lib/supabase';
import { Property, PropertyFilters, PropertyImage } from '@/types';
import { DEMO_PROPERTIES } from '@/lib/mockData';
import { slugify } from '@/utils/formatters';

// In-memory store for demo mode updates during current session
let localDemoProperties: Property[] = [...DEMO_PROPERTIES];

export const propertyService = {
  /**
   * Fetches published properties with filtering, search and sorting.
   * If isAdmin=true, fetches both published and unpublished.
   */
  async getProperties(
    filters: PropertyFilters = {},
    isAdmin: boolean = false
  ): Promise<{ properties: Property[]; totalCount: number }> {
    if (!isSupabaseConfigured) {
      // Demo / preview mode with full client filtering
      let result = [...localDemoProperties];

      if (!isAdmin) {
        result = result.filter((p) => p.published);
      }

      if (filters.transaction_type && filters.transaction_type !== 'all') {
        result = result.filter((p) => p.transaction_type === filters.transaction_type);
      }

      if (filters.property_type && filters.property_type !== 'all') {
        result = result.filter((p) => p.property_type === filters.property_type);
      }

      if (filters.location && filters.location.trim()) {
        const loc = filters.location.toLowerCase();
        result = result.filter((p) => p.location.toLowerCase().includes(loc) || p.address.toLowerCase().includes(loc));
      }

      if (filters.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        result = result.filter((p) => 
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        );
      }

      if (filters.bedrooms && filters.bedrooms !== 'all') {
        result = result.filter((p) => p.bedrooms === Number(filters.bedrooms));
      }

      if (filters.min_price !== undefined && filters.min_price !== '') {
        const min = Number(filters.min_price);
        result = result.filter((p) => (p.transaction_type === 'rent' ? p.monthly_rent >= min : p.price >= min));
      }

      if (filters.max_price !== undefined && filters.max_price !== '') {
        const max = Number(filters.max_price);
        result = result.filter((p) => (p.transaction_type === 'rent' ? p.monthly_rent <= max : p.price <= max));
      }

      // Sort
      if (filters.sortBy === 'price_asc') {
        result.sort((a, b) => (a.transaction_type === 'rent' ? a.monthly_rent - b.monthly_rent : a.price - b.price));
      } else if (filters.sortBy === 'price_desc') {
        result.sort((a, b) => (a.transaction_type === 'rent' ? b.monthly_rent - a.monthly_rent : b.price - a.price));
      } else {
        // newest
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      return { properties: result, totalCount: result.length };
    }

    // Live Supabase query
    let query = supabase
      .from('properties')
      .select('*, property_images(*)', { count: 'exact' });

    if (!isAdmin) {
      query = query.eq('published', true);
    }

    if (filters.transaction_type && filters.transaction_type !== 'all') {
      query = query.eq('transaction_type', filters.transaction_type);
    }

    if (filters.property_type && filters.property_type !== 'all') {
      query = query.eq('property_type', filters.property_type);
    }

    if (filters.location && filters.location.trim()) {
      query = query.ilike('location', `%${filters.location.trim()}%`);
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      query = query.or(`title.ilike.%${filters.searchQuery.trim()}%,description.ilike.%${filters.searchQuery.trim()}%,location.ilike.%${filters.searchQuery.trim()}%`);
    }

    if (filters.bedrooms && filters.bedrooms !== 'all') {
      query = query.eq('bedrooms', Number(filters.bedrooms));
    }

    if (filters.min_price !== undefined && filters.min_price !== '') {
      const min = Number(filters.min_price);
      if (filters.transaction_type === 'rent') {
        query = query.gte('monthly_rent', min);
      } else {
        query = query.gte('price', min);
      }
    }

    if (filters.max_price !== undefined && filters.max_price !== '') {
      const max = Number(filters.max_price);
      if (filters.transaction_type === 'rent') {
        query = query.lte('monthly_rent', max);
      } else {
        query = query.lte('price', max);
      }
    }

    if (filters.sortBy === 'price_asc') {
      query = query.order('price', { ascending: true }).order('monthly_rent', { ascending: true });
    } else if (filters.sortBy === 'price_desc') {
      query = query.order('price', { ascending: false }).order('monthly_rent', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, count, error } = await query;
    if (error) {
      console.error('Error fetching properties from Supabase:', error);
      throw error;
    }

    const properties: Property[] = (data || []).map((row) => ({
      ...row,
      images: (row.property_images || []).sort((a: PropertyImage, b: PropertyImage) => a.sort_order - b.sort_order),
    }));

    return { properties, totalCount: count || 0 };
  },

  /**
   * Fetch featured properties for homepage
   */
  async getFeaturedProperties(limit: number = 4): Promise<Property[]> {
    if (!isSupabaseConfigured) {
      return localDemoProperties
        .filter((p) => p.featured && p.published && p.status === 'available')
        .slice(0, limit);
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('published', true)
      .eq('featured', true)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((row) => ({
      ...row,
      images: (row.property_images || []).sort((a: PropertyImage, b: PropertyImage) => a.sort_order - b.sort_order),
    }));
  },

  /**
   * Fetch single property by slug
   */
  async getPropertyBySlug(slug: string): Promise<Property | null> {
    if (!isSupabaseConfigured) {
      const match = localDemoProperties.find((p) => p.slug === slug);
      return match || null;
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      images: (data.property_images || []).sort((a: PropertyImage, b: PropertyImage) => a.sort_order - b.sort_order),
    };
  },

  /**
   * Fetch single property by ID (for admin editing)
   */
  async getPropertyById(id: string): Promise<Property | null> {
    if (!isSupabaseConfigured) {
      const match = localDemoProperties.find((p) => p.id === id);
      return match || null;
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      images: (data.property_images || []).sort((a: PropertyImage, b: PropertyImage) => a.sort_order - b.sort_order),
    };
  },

  /**
   * Fetch similar properties by category/location
   */
  async getSimilarProperties(propertyId: string, propertyType: string, limit: number = 3): Promise<Property[]> {
    if (!isSupabaseConfigured) {
      return localDemoProperties
        .filter((p) => p.id !== propertyId && p.published && p.property_type === propertyType)
        .slice(0, limit);
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .neq('id', propertyId)
      .eq('published', true)
      .eq('property_type', propertyType)
      .limit(limit);

    if (error) return [];

    return (data || []).map((row) => ({
      ...row,
      images: (row.property_images || []).sort((a: PropertyImage, b: PropertyImage) => a.sort_order - b.sort_order),
    }));
  },

  /**
   * Upload image file to Supabase Storage
   */
  async uploadPropertyImage(file: File): Promise<{ url: string; path: string }> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to upload images to Supabase Storage.');
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Only JPEG, PNG and WebP images are supported');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      path: filePath,
    };
  },

  /**
   * Create a new property with images
   */
  async createProperty(
    propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'images'>,
    images: Array<{ image_url: string; storage_path?: string | null; is_cover: boolean; sort_order: number }>
  ): Promise<Property> {
    const slug = slugify(propertyData.title) + '-' + Math.random().toString(36).substring(2, 6);

    if (!isSupabaseConfigured) {
      const newProp: Property = {
        ...propertyData,
        id: 'demo-' + Date.now(),
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: images.map((img, idx) => ({
          id: 'demo-img-' + idx,
          property_id: 'demo-' + Date.now(),
          image_url: img.image_url,
          storage_path: img.storage_path,
          is_cover: img.is_cover,
          sort_order: img.sort_order,
        })),
      };
      localDemoProperties.unshift(newProp);
      return newProp;
    }

    const { data: createdProperty, error: propError } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        slug,
      })
      .select()
      .single();

    if (propError) throw propError;

    if (images.length > 0) {
      const imagePayload = images.map((img, index) => ({
        property_id: createdProperty.id,
        image_url: img.image_url,
        storage_path: img.storage_path || null,
        is_cover: img.is_cover || index === 0,
        sort_order: img.sort_order ?? index,
      }));

      const { error: imgError } = await supabase
        .from('property_images')
        .insert(imagePayload);

      if (imgError) console.error('Error saving property images:', imgError);
    }

    return await this.getPropertyById(createdProperty.id) as Property;
  },

  /**
   * Update an existing property
   */
  async updateProperty(
    id: string,
    propertyData: Partial<Property>,
    images?: Array<{ image_url: string; storage_path?: string | null; is_cover: boolean; sort_order: number }>
  ): Promise<Property> {
    if (!isSupabaseConfigured) {
      const index = localDemoProperties.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Property not found');
      const updated: Property = {
        ...localDemoProperties[index],
        ...propertyData,
        updated_at: new Date().toISOString(),
      };
      if (images) {
        updated.images = images.map((img, idx) => ({
          id: 'demo-img-' + idx,
          property_id: id,
          image_url: img.image_url,
          storage_path: img.storage_path,
          is_cover: img.is_cover,
          sort_order: img.sort_order,
        }));
      }
      localDemoProperties[index] = updated;
      return updated;
    }

    // Exclude images array from direct properties table update
    const { images: _ignored, ...fieldsToUpdate } = propertyData;

    const { error: propError } = await supabase
      .from('properties')
      .update(fieldsToUpdate)
      .eq('id', id);

    if (propError) throw propError;

    if (images !== undefined) {
      // Delete existing and reinsert updated image list
      await supabase.from('property_images').delete().eq('property_id', id);

      if (images.length > 0) {
        const imagePayload = images.map((img, idx) => ({
          property_id: id,
          image_url: img.image_url,
          storage_path: img.storage_path || null,
          is_cover: img.is_cover || idx === 0,
          sort_order: img.sort_order ?? idx,
        }));

        await supabase.from('property_images').insert(imagePayload);
      }
    }

    return await this.getPropertyById(id) as Property;
  },

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      localDemoProperties = localDemoProperties.filter((p) => p.id !== id);
      return;
    }

    // Fetch images to delete from storage if needed
    const { data: images } = await supabase
      .from('property_images')
      .select('storage_path')
      .eq('property_id', id);

    if (images && images.length > 0) {
      const pathsToDelete = images
        .map((img) => img.storage_path)
        .filter(Boolean) as string[];

      if (pathsToDelete.length > 0) {
        await supabase.storage.from(STORAGE_BUCKET).remove(pathsToDelete);
      }
    }

    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Toggle published status
   */
  async togglePropertyPublished(id: string, published: boolean): Promise<void> {
    if (!isSupabaseConfigured) {
      const p = localDemoProperties.find((item) => item.id === id);
      if (p) p.published = published;
      return;
    }

    const { error } = await supabase.from('properties').update({ published }).eq('id', id);
    if (error) throw error;
  },

  /**
   * Toggle featured status
   */
  async togglePropertyFeatured(id: string, featured: boolean): Promise<void> {
    if (!isSupabaseConfigured) {
      const p = localDemoProperties.find((item) => item.id === id);
      if (p) p.featured = featured;
      return;
    }

    const { error } = await supabase.from('properties').update({ featured }).eq('id', id);
    if (error) throw error;
  },

  /**
   * Dashboard statistics
   */
  async getDashboardStats(): Promise<{
    totalProperties: number;
    publishedProperties: number;
    featuredProperties: number;
    unpublishedProperties: number;
    newEnquiries: number;
  }> {
    if (!isSupabaseConfigured) {
      return {
        totalProperties: localDemoProperties.length,
        publishedProperties: localDemoProperties.filter((p) => p.published).length,
        featuredProperties: localDemoProperties.filter((p) => p.featured).length,
        unpublishedProperties: localDemoProperties.filter((p) => !p.published).length,
        newEnquiries: 3,
      };
    }

    const { count: total } = await supabase.from('properties').select('*', { count: 'exact', head: true });
    const { count: published } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('published', true);
    const { count: featured } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('featured', true);
    const { count: unpublished } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('published', false);
    const { count: newEnquiries } = await supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new');

    return {
      totalProperties: total || 0,
      publishedProperties: published || 0,
      featuredProperties: featured || 0,
      unpublishedProperties: unpublished || 0,
      newEnquiries: newEnquiries || 0,
    };
  }
};
