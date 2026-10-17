export type TransactionType = 'buy' | 'rent';

export type PropertyType = 
  | 'apartment' 
  | 'independent_house' 
  | 'villa' 
  | 'plot' 
  | 'commercial_shop' 
  | 'office';

export type FurnishingStatus = 'unfurnished' | 'semi-furnished' | 'fully-furnished';

export type PropertyStatus = 'available' | 'under_offer' | 'sold' | 'rented';

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  storage_path?: string | null;
  is_cover: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  transaction_type: TransactionType;
  property_type: PropertyType;
  price: number;
  monthly_rent: number;
  location: string;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number;
  area_unit: string;
  furnishing_status: FurnishingStatus | null;
  parking_available: boolean;
  amenities: string[];
  featured: boolean;
  status: PropertyStatus;
  published: boolean;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
}

export type EnquiryType = 'general' | 'callback' | 'site_visit' | 'property_enquiry';
export type EnquiryStatus = 'new' | 'contacted' | 'follow_up' | 'closed';

export interface Enquiry {
  id: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  enquiry_type: EnquiryType;
  property_id?: string | null;
  preferred_location?: string | null;
  budget?: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  property?: {
    id?: string;
    title: string;
    slug: string;
    price: number;
    location: string;
  };
}

export interface SiteSettings {
  id: string;
  business_name: string;
  marathi_name: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  headline: string;
  description: string;
  about_text: string;
  service_locations: string[];
  footer_text: string;
  updated_at?: string;
}

export interface PropertyFilters {
  transaction_type?: 'all' | TransactionType;
  property_type?: 'all' | PropertyType;
  location?: string;
  min_price?: number | '';
  max_price?: number | '';
  bedrooms?: number | 'all';
  searchQuery?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
}
